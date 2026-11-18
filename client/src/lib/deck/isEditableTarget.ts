/** True when a key press on this target should edit text rather than trigger an editor shortcut. */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest('input, textarea, select, [contenteditable="true"]') !== null;
}
