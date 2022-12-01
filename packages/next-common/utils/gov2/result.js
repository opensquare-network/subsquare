export function getGov2ReferendumStateArgs(state = {}) {
  const { name, args } = state;
  if (name !== "Executed") {
    return null;
  }

  const isOk = !!args.result.ok;
  return { isOk };
}
