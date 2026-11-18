# Presentation builder — design

## Context

The admin area can already generate a `.pptx` about the lab (`server/src/modules/presentations/`, `client/src/screens/admin/presentations/`), but it is a one-shot generator with fixed slides: nothing is saved, nothing can be arranged, and there is no way to present from the site. Lab admins want to build decks about MAIA interactively: drag ready-made cards, text, images and charts onto slides, start from templates, customise, save, present full-screen and export.

## Decisions made with the user

| Topic | Decision |
|---|---|
| Users | Lab admins only (`ADMIN`, `SUPER_ADMIN`). No sharing, permissions per deck, or collaboration. |
| Output | Presented from the site. PDF and PowerPoint are exports where each slide is an image (not editable in PowerPoint). |
| Editing model | Free canvas: every element has its own position, size, rotation and layer; snapping and alignment guides. |
| Charts | Bar, line, pie with numbers typed or pasted into a small table. No database-driven charts. |
| Text | Rich text inside a box (bold, italic, colour, links, lists, per-paragraph direction). |
| PDF | One click, produced in the browser from slide images. No headless browser on the server. |
| Transitions | Per-slide transition in present mode. |

## Goals / non-goals

- **Goals:** saved decks; reusable templates and themes defined in advance; existing lab content usable as cards; same rendering in editor, present mode and exports; works in all four languages including RTL.
- **Non-goals:** editable PowerPoint output, real-time collaboration, comments, per-element animations (later), public access, version history.
- **Anti-goal:** a second copy of the lab's content. Cards reference live data by id.

## Approaches considered

- **A. Own editor on plain HTML (chosen).** Absolutely positioned React elements in a fixed-size stage; libraries for move/resize, drag-in, charts, rich text, undo. Existing cards drop in unchanged, no licence, full control. We own selection, layering and shortcuts.
- **B. Embed tldraw.** Editor behaviours for free, but it is a whiteboard that must be bent into a slide tool, needs a commercial licence in production, and brings a heavy bundle with its own styling.
- **C. Konva/Fabric canvas.** Rejected: cards and charts would be redrawn by hand; weak text editing and RTL.

## Design

### Data model (server)

One new Prisma model; the whole deck is one JSON document.

```
Presentation { id, title, isTemplate Boolean, doc Json, createdById, createdAt, updatedAt }
```

`doc` shape (validated with Zod on the server, same types shared by hand on the client):

```
{ version: 1,
  theme: { colors: { background, surface, text, accent, ... }, fontHeading, fontBody },
  slides: [ { id, background?, transition: "none"|"fade"|"slide",
              elements: [ { id, type, x, y, w, h, rotation, props } ] } ] }
```

- Coordinates are in a fixed 1920×1080 space. Array order is layer order.
- Element types and `props`:
  - `text` — Tiptap JSON
  - `image` — `mediaId`, fit mode, corner radius
  - `shape` — rect / ellipse / line, fill, border
  - `chart` — kind, series table, colour overrides
  - `projectCard`, `memberCard`, `publications`, `countTiles` — only the referenced id(s) and display options; data is fetched live
- Endpoints, extending the existing `presentations` module in the standard routes/controller/service/repository/schema pattern, admin-only: list, get, create (optionally from a template id), update (title/doc), duplicate, delete. Existing PPTX generator endpoints stay untouched.
- Saves replace the whole `doc`. The update carries the `updatedAt` it loaded; the server rejects a stale one with 409 so two tabs cannot silently overwrite each other.

### Editor (client)

Route `/admin/presentations` becomes a deck list (with the existing generator kept as a section); `/admin/presentations/:id/edit` is the editor.

```
+--------+----------------------------------+-----------+
| slides | toolbar: undo redo | present | export        |
| 1 [..] +----------------------------------+ inspector |
| 2 [..] |                                  | position  |
| 3 [..] |        1920x1080 stage           | size      |
|  +     |        scaled to fit             | colours   |
+--------+                                  | type-     |
| palette|                                  | specific  |
| text image shape chart cards              | options   |
+--------+----------------------------------+-----------+
```

- **Element registry** — one entry per element type: `{ Render, Inspector, defaultProps, defaultSize }`. Stage, present mode and export all render through `Render`; adding a component later means adding one entry. This is where "predefined components configured in advance" lives.
- **Stage** — a 1920×1080 `div` with `dir="ltr"` always (so RTL UI does not flip coordinates), scaled with a CSS transform. Text elements carry their own `dir`.
- **Move/resize/rotate/snap** — `react-moveable` (with its scale-aware `zoom` and snap guidelines to other elements, slide centre and edges).
- **Palette drag-in and slide reordering** — existing `@dnd-kit`; reuse `client/src/components/common/SortableList.tsx` for the slide strip.
- **State** — a Zustand editor store (doc, current slide, selection) with `zundo` for undo/redo. Not persisted to localStorage. Autosave debounced through a React Query mutation.
- **Text** — Tiptap, editable on double-click, toolbar in the inspector.
- **Charts** — Recharts; the inspector shows an editable table and accepts pasted spreadsheet cells. Colours default to theme tokens.
- **Cards** — wrap existing `ProjectCard`, `MemberPortrait`, `ProjectPublications`, `CountTiles`, using existing hooks in `client/src/hooks/queries/`. Images come from the existing `MediaPicker`.
- **Theme** — theme colours and fonts are set as CSS variables on the stage; elements use them unless overridden per element. Changing the theme restyles the whole deck.
- **Templates** — any deck can be flagged `isTemplate`. "New presentation" offers templates; "add slide" offers slides from templates. A few starter templates are seeded.
- **Keyboard** — delete, arrows to nudge, copy/paste/duplicate, undo/redo, bring forward/send back.

### Present mode

`/admin/presentations/:id/present`, auth-required but outside the sidebar shell. Same `Render` components, read-only, scaled to the viewport, browser Fullscreen API, arrow/space/escape keys, per-slide CSS transition.

### Export

One pipeline for both formats, lazy-loaded: render each slide off-screen at full size, capture with `html-to-image` at 2× → `jsPDF` (one landscape page per slide) or `pptxgenjs` in the browser (one full-bleed image per slide). Uploads are same-origin, so captures are not blocked.

### Conventions that apply (from CLAUDE.md)

Presentational components with logic in hooks/stores; files under ~150 lines; no inline JSX handlers; every new util in `client/src/lib/` gets a test (snapping maths, coordinate scaling, doc validation, pasted-table parsing); all strings via `t()` in all four locale files; logical CSS utilities in editor chrome.

## Build order

Each phase ends in something usable, and gets its own detailed implementation plan.

1. **Decks and core editor** — model, migration, endpoints, deck list, stage, text/image/shape elements, move/resize/snap, layers, undo, autosave.
2. **Components and design** — charts, lab cards, themes, templates, seeded starter templates.
3. **Present** — fullscreen route, navigation, transitions.
4. **Export** — PDF and PowerPoint.

First step of implementation: save this design to `docs/superpowers/specs/2026-11-18-presentation-builder-design.md`, then write the phase 1 plan.

## Left to the builder

Exact snapping thresholds, inspector layout details, starter template designs, chart option depth, thumbnail generation for the deck list and slide strip (live scaled render is acceptable).

## Risks

- `html-to-image` can miss web fonts or late-loading images: wait for fonts and images before capture; verify with Hebrew text and a chart.
- Tiptap inside a transformed, draggable box: drag must be disabled while editing text.
- Live cards change when lab content changes; a deleted project must render a clear placeholder, not crash.

## Verification

- Server: `npm run db:migrate`, `npm run build`; exercise each endpoint as admin and as `USER` (expect 403); stale `updatedAt` returns 409.
- Client: `npm run lint`, `npm run test`, `npm run build`.
- By hand with both dev servers running: create from a template; add every element type; drag, resize, rotate, snap; undo/redo; reload and confirm it was saved; switch UI to Hebrew and confirm positions do not move and Hebrew text boxes are right-to-left; present full-screen with transitions; export PDF and PPTX and compare against the slides.
