import type { IDiaryRule } from "@/common/utils/memoryUtils";

/** Something the user can place: an object in the room or an appointment in the diary. */
export interface IMemoryItem {
  id: string;
  emoji: string;
  labelKey: string;
}

/** A place in the room, positioned by its center in % of the room. */
export interface IRoomSpot extends IMemoryItem {
  x: number;
  y: number;
}

const OBJ = "demos.memory.objects";
const SPOT = "demos.memory.spots";
const DIARY = "demos.memory.tasks.diary";

export const OBJECTS: IMemoryItem[] = [
  { id: "keys", emoji: "🔑", labelKey: `${OBJ}.keys` },
  { id: "glasses", emoji: "👓", labelKey: `${OBJ}.glasses` },
  { id: "phone", emoji: "📱", labelKey: `${OBJ}.phone` },
  { id: "wallet", emoji: "👛", labelKey: `${OBJ}.wallet` },
];

const WATCH: IMemoryItem = { id: "watch", emoji: "⌚", labelKey: `${OBJ}.watch` };
const UMBRELLA: IMemoryItem = { id: "umbrella", emoji: "☂️", labelKey: `${OBJ}.umbrella` };

/** The original objects mixed with two never-seen distractors. */
export const OBJECTS_WITH_DISTRACTORS: IMemoryItem[] = [OBJECTS[3], WATCH, OBJECTS[0], OBJECTS[2], UMBRELLA, OBJECTS[1]];

export const ROOM_SPOTS: IRoomSpot[] = [
  { id: "shelf", emoji: "🪴", labelKey: `${SPOT}.shelf`, x: 13, y: 26 },
  { id: "windowSill", emoji: "🪟", labelKey: `${SPOT}.windowSill`, x: 38, y: 26 },
  { id: "bookcase", emoji: "📚", labelKey: `${SPOT}.bookcase`, x: 63, y: 26 },
  { id: "coatHook", emoji: "🧥", labelKey: `${SPOT}.coatHook`, x: 87, y: 26 },
  { id: "sofa", emoji: "🛋️", labelKey: `${SPOT}.sofa`, x: 13, y: 76 },
  { id: "table", emoji: "🍽️", labelKey: `${SPOT}.table`, x: 38, y: 76 },
  { id: "drawer", emoji: "🗄️", labelKey: `${SPOT}.drawer`, x: 63, y: 76 },
  { id: "chair", emoji: "🪑", labelKey: `${SPOT}.chair`, x: 87, y: 76 },
];

export const APPOINTMENTS: IMemoryItem[] = [
  { id: "doctor", emoji: "🩺", labelKey: `${DIARY}.items.doctor` },
  { id: "hairdresser", emoji: "💇", labelKey: `${DIARY}.items.hairdresser` },
  { id: "dinner", emoji: "🍲", labelKey: `${DIARY}.items.dinner` },
];

export const DIARY_RULES: IDiaryRule[] = [{ id: "doctor", slot: "morning" }, { id: "hairdresser" }, { id: "dinner", slot: "evening" }];

export const DIARY_DAYS = ["mon", "tue", "wed"];
export const DIARY_SLOTS = ["morning", "afternoon", "evening"];
