export default function getExternalProposalHash(call) {
  if (!call) {
    return null;
  }

  const { section, method, args = [] } = call;
  if ("democracy" !== section) {
    return null;
  }

  if (!["externalProposeMajority"].includes(method)) {
    return null;
  }

  if (!args[0]?.value?.lookup) {
    return null;
  }

  const { hash, len } = args[0]?.value?.lookup;
  return { hash, len };
}
