import { useChain } from "next-common/context/chain";
import { collectivePallets } from "next-common/context/collective";
import Chains from "next-common/utils/consts/chains";

export default function useTechcommPallet() {
  const chain = useChain();

  if ([Chains.hyperBridge].includes(chain)) {
    return collectivePallets.technicalCollective;
  }

  return collectivePallets.technicalCommittee;
}
