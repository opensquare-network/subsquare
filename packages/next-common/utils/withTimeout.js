import { noop } from "lodash-es";
import { sleep } from ".";

async function timeout(ms) {
  await sleep(ms);

  const error = new Error("Timeout");
  error.name = "TimeoutError";
  throw error;
}

export async function withTimeout(fn = noop, ms) {
  return Promise.race([timeout(ms), fn()]);
}
