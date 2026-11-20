/**
 * A text field of a delegation announcement, or null when the delegate did not store text.
 *
 * The announcement is JSON a delegate publishes on chain, so each field holds whatever they
 * chose to write — one delegate stored `{ "$ne": 1 }` as its short description. Rendering that
 * straight into React throws "Objects are not valid as a React child" and takes the page down,
 * so every display site reads the field through this and falls back to its empty state.
 */
export function announcementText(value) {
  return typeof value === "string" && value.trim() ? value : null;
}
