import type { IBodyRegion } from "@/common/types/Tens";

/** The figure's viewBox; dot positions below are in these units. */
export const BODY_WIDTH = 200;
export const BODY_HEIGHT = 440;

/** Pain-type answers — i18n keys under `demos.tens.tasks.painType.options`. */
export const PAIN_TYPES = ["sharp", "dull", "burning", "throbbing", "tingling"];

const SHOULDER = ["shoulderTop", "shoulderFront", "upperArm"];
const HAND = ["wrist", "palm", "fingers"];
const KNEE = ["kneecap", "innerKnee", "outerKnee"];
const FOOT = ["ankle", "footTop", "toes"];
const ELBOW = ["elbowTip", "upperArmBack", "forearm"];
const THIGH = ["thighBack", "thighOuter", "kneeBack"];
const CALF = ["calfMuscle", "achilles", "heel"];

/**
 * Dots on the figure. The front view faces the viewer, so the patient's right side is drawn on the
 * left; the back view is the other way round. Region and area ids are i18n keys under
 * `demos.tens.tasks.bodyMap.regions` / `.areas`.
 */
export const BODY_REGIONS: IBodyRegion[] = [
  { id: "head", side: "front", x: 100, y: 28, areas: ["forehead", "temples", "eyes", "jaw"] },
  { id: "chest", side: "front", x: 100, y: 112, areas: ["upperChest", "sternum", "ribs"] },
  { id: "abdomen", side: "front", x: 100, y: 160, areas: ["upperAbdomen", "navelArea", "lowerAbdomen"] },
  { id: "pelvis", side: "front", x: 100, y: 206, areas: ["groin", "hipJoint", "lowerPelvis"] },
  { id: "rightShoulder", side: "front", x: 54, y: 94, areas: SHOULDER },
  { id: "leftShoulder", side: "front", x: 146, y: 94, areas: SHOULDER },
  { id: "rightHand", side: "front", x: 37, y: 224, areas: HAND },
  { id: "leftHand", side: "front", x: 163, y: 224, areas: HAND },
  { id: "rightKnee", side: "front", x: 78, y: 314, areas: KNEE },
  { id: "leftKnee", side: "front", x: 122, y: 314, areas: KNEE },
  { id: "rightFoot", side: "front", x: 78, y: 420, areas: FOOT },
  { id: "leftFoot", side: "front", x: 122, y: 420, areas: FOOT },

  { id: "neck", side: "back", x: 100, y: 64, areas: ["nape", "neckSide", "skullBase"] },
  { id: "upperBack", side: "back", x: 100, y: 112, areas: ["shoulderBlade", "betweenBlades", "upperSpine"] },
  { id: "lowerBack", side: "back", x: 100, y: 168, areas: ["lumbar", "lowerBackSides", "tailbone"] },
  { id: "buttocks", side: "back", x: 100, y: 214, areas: ["buttock", "sacrum", "hipSide"] },
  { id: "leftElbow", side: "back", x: 49, y: 160, areas: ELBOW },
  { id: "rightElbow", side: "back", x: 151, y: 160, areas: ELBOW },
  { id: "leftThigh", side: "back", x: 79, y: 268, areas: THIGH },
  { id: "rightThigh", side: "back", x: 121, y: 268, areas: THIGH },
  { id: "leftCalf", side: "back", x: 79, y: 352, areas: CALF },
  { id: "rightCalf", side: "back", x: 121, y: 352, areas: CALF },
];
