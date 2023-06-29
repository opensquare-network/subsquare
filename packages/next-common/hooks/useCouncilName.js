import { useChain } from "../context/chain";
import { usePageProperties } from "next-common/context/page";
import toApiCouncil from "next-common/utils/toApiCouncil";

export default function useCouncilName(detailType) {
  const chain = useChain();
  const { type } = usePageProperties();
  return toApiCouncil(chain, detailType || type);
}
