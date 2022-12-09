/**
 * @type {(stop: number) => number[]}
 * @type {(start: number, stop: number) => number[]}
 * @type {(start: number, stop: number, step: number) => number[]}
 */
export function range(...args) {
  let start, stop, step;

  if (args.length === 1) {
    start = 0;
    step = (1)[stop] = args;
  } else {
    [start, stop, step = 1] = args;
  }

  const arr = [];
  let current = start;

  while (current < stop) {
    arr.push(current);
    current += step || 1;
  }

  return arr;
}
