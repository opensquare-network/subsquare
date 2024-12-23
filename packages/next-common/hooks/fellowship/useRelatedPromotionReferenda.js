import useRelatedReferenda from "./useRelatedReferenda";

const methods = ["promote", "promoteFast"];

export default function useRelatedPromotionReferenda(address) {
  return useRelatedReferenda(address, methods);
}
