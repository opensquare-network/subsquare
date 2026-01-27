// used for collective timeline executed item
import { capitalize } from "lodash-es";

export default function getMotionExecutedResult(dispatchResult) {
  if (typeof dispatchResult === "boolean") {
    return { Result: dispatchResult ? "Succeed" : "Fail" };
  }

  if (Object.keys(dispatchResult).includes("ok")) {
    return { Result: "Succeed" };
  }

  if (Object.keys(dispatchResult).includes("err")) {
    return {
      Result: `Error: ${capitalize(Object.keys(dispatchResult.err)[0])}`,
    };
  }
}

export function isMotionExecutedSucceed(dispatchResult) {
  if (typeof dispatchResult === "boolean") {
    return dispatchResult;
  } else {
    return Object.keys(dispatchResult).includes("ok");
  }
}

export function getMotionStateArgs(state = {}) {
  if (typeof state === "string") {
    if (state === "Executed") {
      return { isOk: true };
    }
    return null;
  }

  const { state: name, data } = state;
  if (name !== "Executed" || !data) {
    return null;
  }

  const isOk = isMotionExecutedSucceed(data[1]);
  return { isOk };
}
