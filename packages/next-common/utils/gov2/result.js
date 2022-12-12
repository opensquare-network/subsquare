export function getGov2ReferendumStateArgs(state = {}) {
  const { name, args } = state;
  if (name !== "Executed") {
    return null;
  }

  const isOk = Object.keys(args.result).includes("ok");
  return { isOk };
}
