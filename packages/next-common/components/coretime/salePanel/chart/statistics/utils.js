export const INDEX_SIZE = 201;

export function toIndex(blockHeight) {
  return Math.ceil(blockHeight / INDEX_SIZE);
}
