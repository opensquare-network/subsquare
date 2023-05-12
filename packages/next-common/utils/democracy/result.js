export function getDemocracyStateArgs(state = {}, timeline = []) {
  const { state: name, data } = state;
  if (name !== "Executed") {
    return null;
  }

  // By democracy executed event
  if (data) {
    const dispatchResult = data[1];
    if (typeof dispatchResult === "boolean") {
      return dispatchResult;
    } else {
      return Object.keys(dispatchResult).includes("ok");
    }
  }

  // By scheduler#Dispatched event
  const executed = timeline.find(item => item.method === "Executed");
  const isOk = Object.keys(executed.args.result).includes("ok");
  return { isOk };
}
