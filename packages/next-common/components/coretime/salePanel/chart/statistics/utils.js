export const INDEX_SIZE = 200;

export function toIndex(blockHeight) {
  return Math.ceil(blockHeight / INDEX_SIZE);
}
