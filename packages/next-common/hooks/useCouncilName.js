import { useChain } from "../context/chain";
import Chains from "../utils/consts/chains";

export default function useCouncilName() {
  const chain = useChain();

  if ([Chains.karura, Chains.acala].includes(chain)) {
    return "generalCouncil";
  } else {
    return "council";
  }
}
