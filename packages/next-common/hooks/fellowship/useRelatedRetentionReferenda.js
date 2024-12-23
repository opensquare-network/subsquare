import useRelatedReferenda from "./useRelatedReferenda";

const methods = ["approve"];

export default function useRelatedRetentionReferenda(address) {
  return useRelatedReferenda(address, methods);
}
