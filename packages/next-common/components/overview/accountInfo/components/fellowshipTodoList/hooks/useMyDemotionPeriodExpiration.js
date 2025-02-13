import { useDemotionPeriodCheck } from "../../collectivesDemotionPrompt";

export default function useMyDemotionPeriodExpiration({
  collectiveMember,
  coreMember,
  coreParams,
}) {
  const lastProof = coreMember?.lastProof;
  const rank = collectiveMember?.rank;
  const params = coreParams;

  return useDemotionPeriodCheck({
    lastProof,
    rank,
    params,
  });
}
