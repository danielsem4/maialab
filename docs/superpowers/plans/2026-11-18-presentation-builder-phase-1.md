# Presentation Builder — Phase 1 (Decks and Core Editor) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admins can create, list, open, edit and autosave decks made of slides with text, image and shape elements on a free canvas with move/resize/rotate/snap, layering and undo.

**Architecture:** A deck is one JSON document stored on a new `Deck` row and served by a new admin-only `decks` server module. The client keeps the document in a Zustand store (undo via `zundo`), mutates it only through pure functions in `client/src/lib/deck/`, and renders every element through a type registry onto a fixed 1920×1080 stage scaled with a CSS transform.

**Tech Stack:** Express 5, Prisma 7, Zod 4 · React 19, Zustand 5, TanStack Query 5, `@dnd-kit` (installed), new: `react-moveable`, `zundo`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-text-style`, `@tiptap/extension-color`, `@tiptap/extension-text-align`.

**Spec:** `docs/superpowers/specs/2026-11-18-presentation-builder-design.md`

**Deviation from the spec (naming only):** the spec says "extend the `presentations` module" with a `Presentation` model. `PresentationService` / `IPresentationRepository` already belong to the PPTX generator, so the saved-deck code is a separate module named `decks` (model `Deck`, API `/api/admin/decks`). User-facing wording stays "Presentations".

## Global Constraints

- Slide space is fixed: `SLIDE_WIDTH = 1920`, `SLIDE_HEIGHT = 1080`. All element coordinates are in this space; element array order is layer order (last = on top).
- The stage element always has `dir="ltr"`; RTL UI must never change element positions.
- Admin-only: every deck endpoint sits behind `requireAdmin` (`server/src/shared/middlewares/requireAdmin.ts`).
- Saves replace the whole `doc`; an update with a stale `updatedAt` returns **409**.
- Editor state is never persisted to `localStorage`.
- CLAUDE.md rules: presentational components, logic in hooks/stores; no inline handlers in JSX; files ≤ ~150 lines; no manual `useMemo`/`useCallback`; every new util under `client/src/lib/` has a `*.test.ts`; every user-visible string via `t()` with keys added to all four of `client/src/i18n/locales/{en,he,ar,ru}.ts` (enforced by `client/src/i18n/locales.test.ts`); logical Tailwind utilities (`ms-*`, `start-*`) in editor chrome.
- All client HTTP goes through `client/src/lib/axios.ts`.
- The existing PPTX generator (`server/src/modules/presentations/`, `LabDeckSection`) must keep working unchanged.
- The server has no test runner; server tasks are verified with `npm run build` and the curl checks given. Do not add one in this phase.

## Review Focus

1. **Stale save (two tabs):** second tab's save gets 409 → autosave stops, a persistent message tells the user to reload, nothing is overwritten. (Task 1 curl check; Task 4 test `stops after a conflict`.)
2. **Shortcuts while typing:** Delete/Backspace/arrows/Ctrl+Z pressed inside an input, textarea or the Tiptap editor must edit text, not delete or nudge the element. (Task 2 test for `isEditableTarget`.)
3. **Unknown or malformed document:** a doc with an element `type` the client doesn't know, or a doc that fails shape checks, must not crash the editor: unknown elements render as a labelled placeholder box and survive a save untouched. (Task 2 test for `parseDeckDoc`; Task 5 placeholder.)
4. **Degenerate geometry:** resizing to zero/negative size or dragging an element entirely off the slide. Minimum size 20×20; at least 20 px of the element stays on the slide. (Task 2 tests for `clampElement`.)
5. **Missing things:** opening a deleted/non-existent deck id shows a not-found state with a link back; an image whose file was deleted shows a placeholder, not a broken icon. (Task 3 manual check; Task 5.)

---

### Task 1: Server `decks` module

**Files:**
- Modify: `server/prisma/schema.prisma` (add `Deck`, add `decks Deck[]` to `User`)
- Create: `server/src/modules/decks/decks.schema.ts`, `decks.repository.ts`, `decks.service.ts`, `decks.controller.ts`, `decks.routes.ts`, `decks.defaults.ts`
- Modify: `server/src/index.ts` (mount after the `presentations` line)

**Interfaces — Produces (HTTP, all under `/api/admin/decks`, admin-only):**

| Method | Path | Body | Success |
|---|---|---|---|
| GET | `/` | — | `200 { decks: DeckSummary[] }`, newest `updatedAt` first |
| GET | `/:id` | — | `200 { deck: Deck }` · `404` |
| POST | `/` | `{ title: string(1..200), templateId?: number }` | `201 { deck }` · `404` if template missing |
| PATCH | `/:id` | `{ updatedAt: ISO string, title?, doc?, isTemplate? }` | `200 { deck }` · `404` · `409 { message: "Deck was changed elsewhere" }` |
| POST | `/:id/duplicate` | — | `201 { deck }` (title + `" (copy)"`, `isTemplate: false`) |
| DELETE | `/:id` | — | `204` |

`DeckSummary = { id, title, isTemplate, slideCount, updatedAt }`; `Deck = DeckSummary & { doc }`.

- [ ] **Step 1: Add the model and migrate**

```prisma
model Deck {
  id          Int     @id @default(autoincrement())
  title       String
  isTemplate  Boolean @default(false)
  doc         Json
  createdById Int?

  createdBy User? @relation(fields: [createdById], references: [id], onDelete: SetNull)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([isTemplate, updatedAt])
}
```

Run (Postgres up via `docker compose up -d`): `cd server && npx prisma migrate dev --name decks && npm run db:generate`
Expected: new folder `server/prisma/migrations/*_decks`.

- [ ] **Step 2: `decks.schema.ts`** — Zod schemas and DTO types.

```ts
const elementSchema = z.object({
  id: z.string().min(1).max(40),
  type: z.string().min(1).max(40),          // open set: later phases add types without a server change
  x: z.number().finite(), y: z.number().finite(),
  w: z.number().finite().min(1), h: z.number().finite().min(1),
  rotation: z.number().finite(),
  props: z.record(z.string(), z.unknown()),
});
const slideSchema = z.object({
  id: z.string().min(1).max(40),
  background: z.string().max(40).optional(),
  transition: z.enum(['none', 'fade', 'slide']),
  elements: z.array(elementSchema).max(200),
});
export const deckDocSchema = z.object({
  version: z.literal(1),
  theme: z.object({
    colors: z.record(z.string(), z.string().max(40)),
    fontHeading: z.string().max(80),
    fontBody: z.string().max(80),
  }),
  slides: z.array(slideSchema).min(1).max(200),
});
```

Also export `createDeckSchema` and `updateDeckSchema` matching the table above (`updatedAt: z.iso.datetime()`), with `z.infer` DTO types `DeckDoc`, `CreateDeckDto`, `UpdateDeckDto`.

- [ ] **Step 3: `decks.defaults.ts`** — `export function emptyDeckDoc(): DeckDoc` returning version 1, one slide `{ id: randomUUID(), transition: 'none', elements: [] }`, and theme `{ colors: { background: '#ffffff', surface: '#f1f5f9', text: '#0f172a', muted: '#64748b', accent: '#2563eb' }, fontHeading: 'Inter', fontBody: 'Inter' }`.

- [ ] **Step 4: Repository** — `IDeckRepository` + `DeckRepository` using the `prisma` singleton:

```ts
list(): Promise<DeckRecord[]>
findById(id: number): Promise<DeckRecord | null>
create(data: { title: string; doc: DeckDoc; createdById: number }): Promise<DeckRecord>
/** Updates only if the row's updatedAt still equals `expected`. Returns null when it does not (or the row is gone). */
updateIfUnchanged(id: number, expected: Date, data: { title?: string; doc?: DeckDoc; isTemplate?: boolean }): Promise<DeckRecord | null>
remove(id: number): Promise<boolean>
```

`updateIfUnchanged` uses `prisma.deck.updateMany({ where: { id, updatedAt: expected }, data })` then re-reads.

- [ ] **Step 5: Service** — `DeckService(repository)` with `list`, `get`, `create(userId, dto)`, `update(userId, id, dto)`, `duplicate(userId, id)`, `remove(userId, id)`. `update`: when `updateIfUnchanged` returns null, `findById` decides between `AppError('Deck not found', 404)` and `AppError('Deck was changed elsewhere', 409)`. `recordAudit(userId, 'CREATE' | 'DELETE', 'Deck', id)` on create, duplicate and remove; **no audit on update** (autosave would flood the log). `slideCount` is derived from `doc.slides.length` in a `toDeck`/`toDeckSummary` mapper inside the service file.

- [ ] **Step 6: Controller and routes** — follow `server/src/modules/members/members.controller.ts` and `members.routes.ts` exactly (factory, `try/catch → next(err)`, `parseId`, `validateRequest`). Export `decksAdminRouter`; mount `app.use('/api/admin/decks', decksAdminRouter)` in `server/src/index.ts`.

- [ ] **Step 7: Verify**

Run: `cd server && npm run build` → exits 0.
Run `npm run dev`, log in as an admin in the browser, copy the `token` cookie, then:

```bash
C='Cookie: token=<paste>'; B=http://localhost:3001/api/admin/decks; J='Content-Type: application/json'
curl -s -X POST $B -H "$C" -H "$J" -d '{"title":"T1"}'            # 201, deck.doc.slides length 1
curl -s $B -H "$C"                                               # 200, list contains T1 with slideCount 1
curl -s -o /dev/null -w '%{http_code}\n' -X PATCH $B/1 -H "$C" -H "$J" -d '{"updatedAt":"2000-01-01T00:00:00.000Z","title":"x"}'   # 409
curl -s -o /dev/null -w '%{http_code}\n' -X PATCH $B/999999 -H "$C" -H "$J" -d '{"updatedAt":"2000-01-01T00:00:00.000Z","title":"x"}' # 404
curl -s -o /dev/null -w '%{http_code}\n' $B                      # without cookie: 401
```

- [ ] **Step 8: Commit** — `git add server && git commit -m "feat(server): decks module with optimistic-locked saves"`

---

### Task 2: Client document types and pure deck utilities

**Files:**
- Create: `client/src/common/types/Deck.ts`
- Create + Test: `client/src/lib/deck/deckDoc.ts` (+ `.test.ts`), `deckOps.ts` (+ `.test.ts`), `stageGeometry.ts` (+ `.test.ts`), `isEditableTarget.ts` (+ `.test.ts`)

**Interfaces — Produces:**

```ts
// common/types/Deck.ts
export interface IDeckTheme { colors: Record<string, string>; fontHeading: string; fontBody: string }
export interface IDeckElement<P = Record<string, unknown>> {
  id: string; type: string; x: number; y: number; w: number; h: number; rotation: number; props: P;
}
export interface ISlide { id: string; background?: string; transition: "none" | "fade" | "slide"; elements: IDeckElement[] }
export interface IDeckDoc { version: 1; theme: IDeckTheme; slides: ISlide[] }
export interface IDeckSummary { id: number; title: string; isTemplate: boolean; slideCount: number; updatedAt: string }
export interface IDeck extends IDeckSummary { doc: IDeckDoc }
export interface ITextProps { content: unknown /* Tiptap JSON */; dir: "auto" | "ltr" | "rtl"; verticalAlign: "top" | "middle" | "bottom"; fontSize: number }
export interface IImageProps { mediaId: number; url: string; alt: string; fit: "cover" | "contain"; radius: number }
export interface IShapeProps { shape: "rect" | "ellipse" | "line"; fill: string; stroke: string; strokeWidth: number; radius: number }

// lib/deck/deckDoc.ts
export const SLIDE_WIDTH = 1920; export const SLIDE_HEIGHT = 1080; export const MIN_ELEMENT_SIZE = 20;
export function newId(): string                        // crypto.randomUUID()
export function createSlide(): ISlide
export function parseDeckDoc(value: unknown): IDeckDoc | null   // null when version !== 1, slides is not a non-empty array, or any slide lacks an elements array; unknown element types are kept as-is

// lib/deck/deckOps.ts — every function returns a NEW doc and never mutates its input
export function addSlide(doc: IDeckDoc, afterSlideId?: string): { doc: IDeckDoc; slideId: string }
export function duplicateSlide(doc: IDeckDoc, slideId: string): { doc: IDeckDoc; slideId: string }   // new ids for the slide and every element
export function removeSlide(doc: IDeckDoc, slideId: string): IDeckDoc      // no-op when it is the last slide
export function reorderSlides(doc: IDeckDoc, slideIds: string[]): IDeckDoc
export function updateSlide(doc: IDeckDoc, slideId: string, patch: Partial<Pick<ISlide, "background" | "transition">>): IDeckDoc
export function addElement(doc: IDeckDoc, slideId: string, element: IDeckElement): IDeckDoc           // appended = on top
export function updateElement(doc: IDeckDoc, slideId: string, elementId: string, patch: Partial<Omit<IDeckElement, "id" | "type">>): IDeckDoc   // `props` is shallow-merged
export function removeElements(doc: IDeckDoc, slideId: string, elementIds: string[]): IDeckDoc
export function duplicateElements(doc: IDeckDoc, slideId: string, elementIds: string[]): { doc: IDeckDoc; newIds: string[] }  // copies offset by +40,+40
export type LayerMove = "forward" | "backward" | "front" | "back";
export function moveLayer(doc: IDeckDoc, slideId: string, elementId: string, move: LayerMove): IDeckDoc

// lib/deck/stageGeometry.ts
export interface IBox { x: number; y: number; w: number; h: number }
export function clampElement(box: IBox): IBox          // w,h ≥ MIN_ELEMENT_SIZE; at least MIN_ELEMENT_SIZE px stays inside the slide on each axis
export function centeredBox(w: number, h: number, center?: IPoint): IBox   // default center = slide centre; result passed through clampElement
export function containScale(containerW: number, containerH: number, padding?: number): number  // scale fitting 1920×1080 into the container; ≥ 0.05
export const STAGE_GUIDELINES = { vertical: [0, 960, 1920], horizontal: [0, 540, 1080] } as const;

// lib/deck/isEditableTarget.ts
export function isEditableTarget(target: EventTarget | null): boolean   // true for input, textarea, select, and anything inside [contenteditable="true"]
```

- [ ] **Step 1: Write failing tests.** Assertions that pin behaviour (write them all, plus a "does not mutate input" check per `deckOps` function using `structuredClone` + `toEqual`):

```ts
// deckDoc.test.ts
expect(parseDeckDoc({ version: 2, slides: [] })).toBeNull();
expect(parseDeckDoc({ version: 1, theme, slides: [] })).toBeNull();
expect(parseDeckDoc({ version: 1, theme, slides: [{ id: "s", transition: "none" }] })).toBeNull();
const future = { version: 1, theme, slides: [{ id: "s", transition: "none", elements: [{ id: "e", type: "hologram", x: 0, y: 0, w: 10, h: 10, rotation: 0, props: { a: 1 } }] }] };
expect(parseDeckDoc(future)).toEqual(future);                      // unknown types survive

// deckOps.test.ts
expect(removeSlide(oneSlideDoc, "s1")).toEqual(oneSlideDoc);        // last slide is never removed
const dup = duplicateSlide(doc, "s1");                               // inserted directly after s1
expect(dup.doc.slides[1].id).toBe(dup.slideId);
expect(dup.doc.slides[1].elements[0].id).not.toBe(doc.slides[0].elements[0].id);
expect(updateElement(doc, "s1", "a", { props: { fill: "#000" } }).slides[0].elements[0].props)
  .toEqual({ ...doc.slides[0].elements[0].props, fill: "#000" });   // shallow merge
// elements [a, b, c]
expect(ids(moveLayer(doc, "s1", "a", "forward"))).toEqual(["b", "a", "c"]);
expect(ids(moveLayer(doc, "s1", "a", "front"))).toEqual(["b", "c", "a"]);
expect(ids(moveLayer(doc, "s1", "c", "back"))).toEqual(["c", "a", "b"]);
expect(ids(moveLayer(doc, "s1", "c", "forward"))).toEqual(["a", "b", "c"]);   // already on top
expect(updateElement(doc, "s1", "missing", { x: 5 })).toEqual(doc);

// stageGeometry.test.ts
expect(clampElement({ x: 0, y: 0, w: -5, h: 0 })).toMatchObject({ w: 20, h: 20 });
expect(clampElement({ x: 5000, y: 5000, w: 100, h: 100 })).toMatchObject({ x: 1900, y: 1060 });
expect(clampElement({ x: -5000, y: -5000, w: 100, h: 100 })).toMatchObject({ x: -80, y: -80 });
expect(centeredBox(400, 200)).toEqual({ x: 760, y: 440, w: 400, h: 200 });
expect(containScale(960, 540, 0)).toBe(0.5);
expect(containScale(0, 0)).toBe(0.05);

// isEditableTarget.test.ts — build nodes with document.createElement
input → true; textarea → true; span inside div[contenteditable="true"] → true; plain div → false; null → false
```

- [ ] **Step 2:** Run `cd client && npx vitest run src/lib/deck` → FAIL (modules missing).
- [ ] **Step 3:** Implement the four modules and `Deck.ts` to the signatures above. Reuse `IPoint` from `client/src/common/utils/geometry.ts`.
- [ ] **Step 4:** Run `npx vitest run src/lib/deck` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(client): deck document types and pure operations"`

---

### Task 3: Deck list, routes and editor shell

**Files:**
- Create: `client/src/api/decksApi.ts`, `client/src/hooks/queries/useDeckQueries.ts`
- Modify: `client/src/hooks/queries/queryKeys.ts` (add `decks: { all: ["decks"], list: () => ["decks","list"], detail: (id) => ["decks","detail",id] }`)
- Create: `client/src/common/components/layouts/AuthOnlyLayout.tsx`
- Create: `client/src/screens/admin/presentations/components/DecksSection.tsx`, `DeckListRow.tsx`, `NewDeckDialog.tsx`; `hooks/useDecksList.ts`
- Modify: `client/src/screens/admin/presentations/PresentationsBuilder.tsx` (render `DecksSection` above `LabDeckSection`)
- Create: `client/src/screens/admin/presentations/editor/DeckEditor.tsx`, `editor/hooks/useDeckLoader.ts`, `editor/components/DeckNotFound.tsx`
- Modify: `client/src/router.tsx`, the four locale files

**Interfaces:**
- Consumes: Task 1 HTTP API; Task 2 `IDeck`, `IDeckSummary`, `IDeckDoc`, `parseDeckDoc`.
- Produces:

```ts
// api/decksApi.ts
export interface IDeckUpdate { updatedAt: string; title?: string; doc?: IDeckDoc; isTemplate?: boolean }
export const decksApi: {
  list(): Promise<IDeckSummary[]>; get(id: number): Promise<IDeck>;
  create(input: { title: string; templateId?: number }): Promise<IDeck>;
  update(id: number, input: IDeckUpdate): Promise<IDeck>;
  duplicate(id: number): Promise<IDeck>; remove(id: number): Promise<void>;
}
// hooks/queries/useDeckQueries.ts
useDecks(); useDeck(id: number);                         // useDeck: staleTime Infinity, refetchOnWindowFocus false (the editor store owns the doc after load)
useCreateDeck(onCreated: (deck: IDeck) => void); useDuplicateDeck(); useDeleteDeck();   // via useApiMutation, invalidate queryKeys.decks.all
// editor/hooks/useDeckLoader.ts
export function useDeckLoader(): { status: "loading" | "notFound" | "invalid" | "ready"; deck: IDeck | null }  // id from useParams; 404 → notFound; parseDeckDoc null → invalid
```

- [ ] **Step 1: `AuthOnlyLayout`** — same guard as `ProtectedLayout` (`useAuthStore` `userId`, `<Navigate to="/login" replace />`, `useSessionUser`) rendering only `<Outlet />` in a `h-svh` container. No sidebar or header.

- [ ] **Step 2: Routes** — in `router.tsx` add a sibling of the `/admin` route:

```tsx
{
  element: <AuthOnlyLayout />,
  children: [
    { path: "/admin/presentations/:id/edit", ...lazyPage(() => import("@/screens/admin/presentations/editor/DeckEditor")) },
  ],
},
```

- [ ] **Step 3: API module and query hooks** to the signatures above, following `membersApi.ts` / `useMemberQueries.ts`.

- [ ] **Step 4: Deck list** — `DecksSection` (presentational) driven by `useDecksList`: `QueryState` wrapper; each `DeckListRow` shows title, template badge when `isTemplate`, slide count, `relativeTime` (`client/src/common/utils/relativeTime.ts`) of `updatedAt`, and actions Edit (link to `/admin/presentations/:id/edit`), Duplicate, `ConfirmDeleteButton`. "New presentation" opens `NewDeckDialog`: a title field plus a "Start from" select listing "Blank" and every deck with `isTemplate`; on create, navigate to the new deck's edit route.

- [ ] **Step 5: Editor shell** — `DeckEditor` uses `useDeckLoader`: loading → existing spinner pattern from `QueryState`; `notFound`/`invalid` → `DeckNotFound` (message + link back to `/admin/presentations`); `ready` → for now a header with the deck title and a back link (Task 4 fills in the body).

- [ ] **Step 6: i18n** — add a `decks` block to all four locale files with at least: `sectionTitle`, `sectionDesc`, `newDeck`, `titleLabel`, `startFrom`, `blank`, `template`, `slideCount` (with `{{count}}`), `edit`, `duplicate`, `duplicated`, `created`, `empty`, `notFound`, `invalidDoc`, `backToList`. Change `presentations.description` to cover both building and generating.

- [ ] **Step 7: Verify** — `cd client && npm run lint && npx vitest run && npm run build` all pass. In the browser: create a deck from the Presentations page → lands on `/admin/presentations/<id>/edit` with its title; `/admin/presentations/999999/edit` shows the not-found state; duplicate and delete work from the list; the old "Lab overview deck" generator still downloads a PPTX.

- [ ] **Step 8: Commit** — `git commit -m "feat(client): deck list, routes and editor shell"`

---

### Task 4: Editor store, autosave and slide strip

**Files:**
- Install: `cd client && npm i zundo`
- Create + Test: `client/src/store/useDeckEditorStore.ts` (+ `.test.ts`)
- Create + Test: `client/src/lib/deck/saveQueue.ts` (+ `.test.ts`)
- Create: `client/src/hooks/common/useContainScale.ts`
- Create: `client/src/components/deck/SlideView.tsx`, `client/src/components/deck/ElementView.tsx`
- Create: `editor/hooks/useDeckAutosave.ts`, `editor/components/EditorHeader.tsx`, `SaveIndicator.tsx`, `SlideStrip.tsx`, `SlideThumbnail.tsx`; `editor/hooks/useSlideStrip.ts`
- Modify: `editor/DeckEditor.tsx`, locale files

**Interfaces:**
- Consumes: Task 2 ops and types; Task 3 `decksApi.update`, `useDeckLoader`.
- Produces:

```ts
// store/useDeckEditorStore.ts — create()(temporal(..., { partialize: (s) => ({ doc: s.doc }), limit: 100 }))
interface DeckEditorState {
  deckId: number | null; title: string; doc: IDeckDoc | null;
  currentSlideId: string | null; selectedIds: string[]; editingTextId: string | null;
  load(deck: IDeck): void;                 // sets everything, clears temporal history
  reset(): void;
  setTitle(title: string): void;
  selectSlide(id: string): void; select(ids: string[]): void; setEditingText(id: string | null): void;
  apply(op: (doc: IDeckDoc) => IDeckDoc): void;   // the ONLY way the doc changes; no-op (no history entry) when op returns the same reference or doc is null
  addSlide(): void; duplicateSlide(id: string): void; removeSlide(id: string): void; reorderSlides(ids: string[]): void;
}
export const useDeckEditorStore: UseBoundStore<...>;   // undo/redo: useDeckEditorStore.temporal.getState().undo() / .redo()
export function selectCurrentSlide(s: DeckEditorState): ISlide | null

// lib/deck/saveQueue.ts — framework-free so it can be unit-tested with fake timers
export type SaveState = "saved" | "dirty" | "saving" | "conflict" | "error";
export interface ISaveSnapshot { title: string; doc: IDeckDoc }
export function createSaveQueue(opts: {
  delayMs: number;
  initialUpdatedAt: string;
  save: (snapshot: ISaveSnapshot, updatedAt: string) => Promise<{ updatedAt: string }>;   // rejects with { status: 409 } on conflict
  onState: (state: SaveState) => void;
}): { schedule(snapshot: ISaveSnapshot): void; flush(): Promise<void>; dispose(): void }

// hooks/common/useContainScale.ts
export function useContainScale<T extends HTMLElement>(padding?: number): { containerRef: RefObject<T | null>; scale: number }  // ResizeObserver + containScale()

// components/deck/SlideView.tsx — read-only slide at natural 1920×1080 size; callers scale it
export function SlideView(props: { slide: ISlide; theme: IDeckTheme }): JSX.Element
// components/deck/ElementView.tsx — positions one element (left/top/width/height/rotate) and renders its body; in this task every type renders the "unknown element" placeholder; Task 5 swaps in the registry
export function ElementView(props: { element: IDeckElement; theme: IDeckTheme }): JSX.Element
```

- [ ] **Step 1: Failing tests**

```ts
// useDeckEditorStore.test.ts  (reset the store in beforeEach)
load(deck) → currentSlideId === deck.doc.slides[0].id; temporal pastStates.length === 0
apply(d => d) → pastStates.length stays 0
addSlide() → slides.length 2, currentSlideId is the new slide; undo() → slides.length 1 and currentSlideId falls back to an existing slide
removeSlide(current) → currentSlideId moves to the neighbour; selectedIds === []
selectSlide(other) → selectedIds === [] and editingTextId === null

// saveQueue.test.ts  (vi.useFakeTimers)
"debounces": schedule ×3 within 1500 ms → save called once, with the last snapshot
"uses the returned updatedAt": first save resolves { updatedAt: "B" } → second save called with "B"
"does not overlap": schedule during an in-flight save → second save starts only after the first resolves
"stops after a conflict": save rejects { status: 409 } → onState("conflict"); later schedule() calls never invoke save
"retries after an error": save rejects { status: 500 } → onState("error"); next schedule() saves again
"flush": schedule then flush() → save called immediately, no timer wait
```

- [ ] **Step 2:** Run `npx vitest run src/store/useDeckEditorStore.test.ts src/lib/deck/saveQueue.test.ts` → FAIL.
- [ ] **Step 3:** Implement the store and `saveQueue`. Selection invariants live in the store: changing or removing the current slide clears `selectedIds` and `editingTextId`; after any undo/redo, if `currentSlideId` no longer exists, fall back to the first slide (subscribe to `temporal`).
- [ ] **Step 4:** Tests PASS.
- [ ] **Step 5: `useDeckAutosave(initialUpdatedAt)`** — creates one `saveQueue` (`delayMs: 1500`, `save` → `decksApi.update(deckId, { ...snapshot, updatedAt })`), subscribes to the store and calls `schedule` whenever `doc` or `title` changes, `flush()` on unmount, and registers a `beforeunload` prompt while state is `dirty`/`saving`. Returns `SaveState`. Map an Axios error to `{ status }` before rejecting.
- [ ] **Step 6: UI** — `EditorHeader`: back link, inline-editable title (`Input`), Undo/Redo buttons (disabled from `temporal` `pastStates`/`futureStates` length), `SaveIndicator` (saved / saving / unsaved / error; `conflict` renders a non-dismissible `Alert` with a Reload button). `SlideStrip` (start side column): `SortableList` of `SlideThumbnail` (a 192×108 box containing `SlideView` under `transform: scale(0.1)`, `transform-origin: top left`, `pointer-events-none`, slide number, ring when current), plus Add, Duplicate, Delete buttons for the current slide (Delete disabled with one slide). `DeckEditor` calls `load(deck)` once per deck id and `reset()` on unmount, and lays out header / strip / an empty centre area using `useContainScale` showing the current slide via `SlideView`.
- [ ] **Step 7: i18n** — add `decks.editor.{back, untitled, undo, redo, saved, saving, unsaved, saveError, conflictTitle, conflictBody, reload, addSlide, duplicateSlide, deleteSlide, slideNumber, unknownElement}` to all four locales.
- [ ] **Step 8: Verify** — `npm run lint && npx vitest run && npm run build`. Browser: add/duplicate/delete/reorder slides, rename; "Saving…" then "Saved"; reload → changes persisted; undo/redo restore slides. Open the same deck in two tabs, edit in A, then edit in B → B shows the conflict alert and makes no further requests (Network tab).
- [ ] **Step 9: Commit** — `git commit -m "feat(client): deck editor store, autosave and slide strip"`

---

### Task 5: Stage — element registry, shapes, images, move/resize, palette, inspector, shortcuts

**Files:**
- Install: `cd client && npm i react-moveable`
- Create: `client/src/components/deck/elements/registry.ts`, `elements/types.ts`, `elements/UnknownElement.tsx`, `elements/shape/ShapeRender.tsx`, `elements/shape/ShapeInspector.tsx`, `elements/image/ImageRender.tsx`, `elements/image/ImageInspector.tsx`
- Modify: `client/src/components/deck/ElementView.tsx` (use the registry)
- Create: `editor/components/Stage.tsx`, `StageElement.tsx`, `StageMoveable.tsx`, `Palette.tsx`, `PaletteItem.tsx`, `Inspector.tsx`, `GeometryFields.tsx`, `LayerButtons.tsx`, `ColorField.tsx`, `SlideSettings.tsx`
- Create: `editor/hooks/useStageInteractions.ts`, `usePaletteDrop.ts`, `useEditorShortcuts.ts`, `useSelectedElement.ts`
- Create + Test: `client/src/lib/deck/shortcuts.ts` (+ `.test.ts`)
- Modify: `editor/DeckEditor.tsx`, locale files

**Interfaces:**
- Consumes: store `apply`, `select`, `selectedIds`, `selectCurrentSlide`; ops from Task 2; `useContainScale`, `SlideView`; `MediaPicker` (`onSelect(media: IMedia)`), `toLocalPoint` from `client/src/common/utils/geometry.ts`.
- Produces:

```ts
// components/deck/elements/types.ts
export interface IElementRenderProps<P> { element: IDeckElement<P>; theme: IDeckTheme }
export interface IElementInspectorProps<P> { element: IDeckElement<P>; onChange: (props: Partial<P>) => void }
export interface IElementDefinition<P = any> {
  type: string;
  labelKey: string;                 // i18n key shown in the palette and inspector
  icon: LucideIcon;
  defaultSize: { w: number; h: number };
  createProps: () => P;
  Render: ComponentType<IElementRenderProps<P>>;
  Inspector: ComponentType<IElementInspectorProps<P>> | null;
  keepRatio?: boolean;
}
// components/deck/elements/registry.ts
export const elementRegistry: Record<string, IElementDefinition>;      // this task: "shape", "image"; Task 6 adds "text"
export const paletteOrder: string[];
export function getElementDefinition(type: string): IElementDefinition | null
export function createElementOfType(type: string, center?: IPoint): IDeckElement    // newId(), centeredBox(defaultSize, center), rotation 0, createProps()

// lib/deck/shortcuts.ts
export type EditorCommand =
  | { kind: "delete" } | { kind: "duplicate" } | { kind: "undo" } | { kind: "redo" }
  | { kind: "nudge"; dx: number; dy: number } | { kind: "layer"; move: LayerMove } | { kind: "deselect" };
export function commandFromKey(e: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "shiftKey">): EditorCommand | null
```

Defaults: shape `{ shape: "rect", fill: "var(--deck-accent)", stroke: "transparent", strokeWidth: 0, radius: 0 }`, size 400×300. Image has no palette default: choosing the palette item opens `MediaPicker`, and the element is created from the picked `IMedia` (`{ mediaId, url, alt, fit: "cover", radius: 0 }`), sized to the media's aspect ratio with the longer side 800 (600×400 when dimensions are null).

- [ ] **Step 1: Failing test for `commandFromKey`**

```ts
Delete, Backspace → { kind: "delete" }
ArrowLeft → nudge dx -1, dy 0;  Shift+ArrowDown → nudge dx 0, dy 10
Ctrl+z and Meta+z → undo;  Ctrl+Shift+z, Meta+Shift+z, Ctrl+y → redo
Ctrl+d → duplicate;  Escape → deselect
"]" → layer forward;  "[" → backward;  Ctrl+"]" → front;  Ctrl+"[" → back
"a", Ctrl+s → null
```

- [ ] **Step 2:** `npx vitest run src/lib/deck/shortcuts.test.ts` → FAIL, then implement → PASS.

- [ ] **Step 3: Registry and renderers.** `SlideView` sets theme colours as CSS variables `--deck-<name>` and fonts `--deck-font-heading` / `--deck-font-body` on its root, with `background: slide.background ?? var(--deck-background)`. `ElementView` looks the type up in the registry and falls back to `UnknownElement` (dashed box, `decks.editor.unknownElement` + the type name). `ShapeRender`: a `div` for rect/ellipse (`border-radius: 50%` for ellipse), an SVG line for `line`. `ImageRender`: `<img>` with `object-fit`, `draggable={false}`; on `onError` swap to a muted placeholder with an image-off icon and the alt text.

- [ ] **Step 4: Stage.** `Stage` fills the centre area: `useContainScale(48)` on the container; inside it a wrapper sized `1920*scale × 1080*scale` containing the 1920×1080 stage `div` (`dir="ltr"`, `transform: scale(scale)`, `transform-origin: top left`, theme variables as in `SlideView`). Each element is a `StageElement` (absolute, `data-element-id`, renders the registry `Render`). Pointer-down on an element selects it (Shift toggles in the selection); pointer-down on empty stage clears the selection.

- [ ] **Step 5: `StageMoveable`** — one `<Moveable>` targeting the selected elements' DOM nodes:
  `draggable resizable rotatable snappable`, `zoom={1 / scale}`, `keepRatio` from the definition (single selection only), `throttleDrag={0}`, `snapThreshold={8}`, `isDisplaySnapDigit={false}`, `verticalGuidelines`/`horizontalGuidelines` from `STAGE_GUIDELINES`, `elementGuidelines` = the non-selected element nodes, `snapDirections` and `elementSnapDirections` all of top/left/bottom/right/center/middle, rotation snapping every 15° (`snapRotationDegrees`).
  During `onDrag`/`onResize`/`onRotate` (and the group variants) write the transform straight to the target's style; on the matching `…End` event read the final values, run `clampElement`, and commit with **one** `apply(updateElement(...))` per gesture (a single `apply` composing all elements for group gestures) so each gesture is one undo step. Disabled when `editingTextId` is set.

- [ ] **Step 6: Palette.** `Palette` renders `paletteOrder` as `PaletteItem`s inside a `DndContext` that also wraps `Stage`. Each item is a `useDraggable` button; the stage is a `useDroppable`. `usePaletteDrop` handles `onDragEnd`: if dropped over the stage, convert the dragged item's translated rect centre with `toLocalPoint(cx, cy, stageRect, SLIDE_WIDTH)` and `apply(addElement(..., createElementOfType(type, point)))`, then select it. Clicking (or Enter on) an item adds it at the slide centre. Show a `DragOverlay` with the item's icon and label.

- [ ] **Step 7: Inspector** (end side column). No selection → `SlideSettings` (slide background via `ColorField`, with a "use theme" reset). One element → `GeometryFields` (X, Y, W, H, rotation as number inputs; commit on blur/Enter through `clampElement`), `LayerButtons` (front / forward / backward / back), Duplicate, Delete, then the definition's `Inspector`. Several → only Duplicate/Delete. `ColorField` = native `<input type="color">` plus swatches for each theme colour that store `var(--deck-<name>)`. `ShapeInspector`: shape kind, fill, stroke, stroke width, corner radius. `ImageInspector`: replace via `MediaPicker`, fit, corner radius, alt text.

- [ ] **Step 8: Shortcuts.** `useEditorShortcuts` adds one `keydown` listener on `window`: return early when `isEditableTarget(e.target)`; otherwise `commandFromKey(e)` → `preventDefault()` and run it against the store (nudge = `updateElement` with x+dx, y+dy through `clampElement`; delete clears the selection; duplicate selects the copies).

- [ ] **Step 9: i18n** — `decks.elements.{shape, image}`, `decks.palette.title`, `decks.inspector.{position, size, rotation, layer, bringToFront, bringForward, sendBackward, sendToBack, duplicate, delete, fill, stroke, strokeWidth, radius, shapeKind, rect, ellipse, line, fit, cover, contain, alt, replaceImage, slideBackground, useTheme, multiSelected}` in all four locales.

- [ ] **Step 10: Verify** — `npm run lint && npx vitest run && npm run build`. Browser:
  - drag a shape from the palette → it lands under the cursor; click the palette item → lands centred
  - move, resize, rotate; magenta guides appear and it snaps to slide centre/edges and to another element
  - one Ctrl+Z undoes a whole drag; redo restores it
  - layer buttons change overlap order; arrows nudge 1 px, Shift 10 px; Delete removes; typing in the X field does not trigger shortcuts
  - add an image from the media library; delete that file in the Media admin and reload → placeholder, no crash
  - shrink the window → the stage rescales and dragging still tracks the cursor exactly
  - switch the UI language to Hebrew → panels swap sides, every element stays where it was
  - reload → everything persisted; thumbnails in the slide strip match the stage

- [ ] **Step 11: Commit** — `git commit -m "feat(client): deck stage with shapes, images, snapping and inspector"`

---

### Task 6: Rich text element

**Files:**
- Install: `cd client && npm i @tiptap/react @tiptap/starter-kit @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-text-align`
- Create + Test: `client/src/lib/deck/richText.ts` (+ `.test.ts`)
- Create: `client/src/components/deck/elements/text/TextRender.tsx`, `text/TextInspector.tsx`, `text/textExtensions.ts`, `text/deckText.css`
- Create: `editor/components/TextEditorBox.tsx`, `TextFormatBar.tsx`; `editor/hooks/useTextEditing.ts`; `editor/ActiveTextEditorContext.tsx`
- Modify: `elements/registry.ts` (add `"text"`, first in `paletteOrder`), `editor/components/StageElement.tsx`, `Inspector.tsx`, `DeckEditor.tsx`, locale files

**Interfaces:**
- Consumes: `ITextProps`; store `editingTextId`, `setEditingText`, `apply`; `IElementDefinition`.
- Produces:

```ts
// text/textExtensions.ts — the single extension list used for both editing and static rendering
export const textExtensions: Extensions;   // StarterKit (link: { openOnClick: false, protocols: ["http", "https", "mailto"] }), TextStyle, Color, TextAlign.configure({ types: ["heading", "paragraph"] })

// lib/deck/richText.ts
export function emptyTextContent(placeholder: string): JSONContent     // one paragraph containing the placeholder
export function isEmptyTextContent(content: unknown): boolean          // true for null/undefined, non-objects, and docs whose text is only whitespace
export function renderTextHtml(content: unknown): string               // generateHTML(content, textExtensions); "" when content is not a valid doc (never throws)

// editor/ActiveTextEditorContext.tsx
export const ActiveTextEditorContext: Context<{ editor: Editor | null; setEditor: (e: Editor | null) => void }>
```

Text defaults: size 800×200, `{ content: emptyTextContent(t("decks.elements.textPlaceholder")), dir: "auto", verticalAlign: "top", fontSize: 40 }`.

- [ ] **Step 1: Failing tests**

```ts
expect(isEmptyTextContent(null)).toBe(true);
expect(isEmptyTextContent({ type: "doc", content: [{ type: "paragraph" }] })).toBe(true);
expect(isEmptyTextContent(emptyTextContent("Hi"))).toBe(false);
expect(renderTextHtml(emptyTextContent("Hi"))).toContain("<p>Hi</p>");
expect(renderTextHtml({ nonsense: true })).toBe("");
expect(renderTextHtml("<script>")).toBe("");
// link safety: a doc whose link mark has href "javascript:alert(1)" must not produce that href
expect(renderTextHtml(docWithLink("javascript:alert(1)"))).not.toContain("javascript:");
```

- [ ] **Step 2:** FAIL → implement `richText.ts` and `textExtensions.ts` → PASS. If Tiptap's Link config alone does not strip the `javascript:` href in `generateHTML`, pass the href through `safeHref` (`client/src/common/utils/safeHref.ts`) in the Link extension's `renderHTML`.

- [ ] **Step 3: Static render.** `TextRender` outputs `renderTextHtml(props.content)` via `dangerouslySetInnerHTML` inside a flex column container (`justify-content` from `verticalAlign`, `font-size: props.fontSize px`, `color: var(--deck-text)`, `font-family: var(--deck-font-body)`, headings use `--deck-font-heading`, `dir={props.dir}`). `deckText.css` (scoped under `.deck-text`): `p, h1, h2, h3, li { unicode-bidi: plaintext; text-align: start; }` so each paragraph takes its direction from its own first strong character when `dir` is `auto`; list and heading sizes in `em`; links underlined in `--deck-accent`.

- [ ] **Step 4: Editing.** Double-click (or Enter with one text element selected) calls `setEditingText(id)`. While editing, `StageElement` renders `TextEditorBox` instead of `TextRender`: `useEditor({ extensions: textExtensions, content, autofocus: "end" })` + `EditorContent` with the same `.deck-text` container styles, registering the editor in `ActiveTextEditorContext`. On blur outside both the box and the format bar, or on Escape: commit `apply(updateElement(..., { props: { content: editor.getJSON() } }))` **once** (skip when unchanged), then `setEditingText(null)`. Pointer events inside the box must not start a drag (Task 5 already disables `StageMoveable` while editing) and must not clear the selection.

- [ ] **Step 5: Format bar.** While a text element is being edited, the inspector shows `TextFormatBar` bound to the context editor: bold, italic, underline, strike, heading 1/2/paragraph, bullet list, numbered list, align start/centre/end/justify, text colour (`ColorField`), link (prompt for URL, unset when empty). Buttons use `onMouseDown` `preventDefault` so the editor keeps focus. `TextInspector` (shown whenever a text element is selected): font size, direction (auto/ltr/rtl), vertical alignment.

- [ ] **Step 6: i18n** — `decks.elements.{text, textPlaceholder}`, `decks.text.{bold, italic, underline, strike, heading1, heading2, paragraph, bulletList, numberedList, alignStart, alignCenter, alignEnd, justify, color, link, linkPrompt, fontSize, direction, dirAuto, dirLtr, dirRtl, verticalAlign, top, middle, bottom}` in all four locales.

- [ ] **Step 7: Verify** — `npm run lint && npx vitest run && npm run build`. Browser:
  - add a text box, double-click, type; bold one word, colour another, make a bullet list, add a link
  - click outside → identical look in static mode and in the slide thumbnail
  - Backspace/arrow keys/Ctrl+Z while typing edit the text only; after leaving the box, one Ctrl+Z reverts the whole text edit
  - a box with an English paragraph followed by a Hebrew paragraph: each aligns to its own side with `dir` auto; forcing RTL flips both
  - move and resize the text box after editing; reload → content persisted

- [ ] **Step 8: Phase check against the spec's verification list** — server `npm run build`; client `npm run lint`, `npm run test -- --run`, `npm run build`; then as a `USER`-role account (or logged out) confirm `/api/admin/decks` returns 403/401.

- [ ] **Step 9: Commit** — `git commit -m "feat(client): rich text element for decks"`
