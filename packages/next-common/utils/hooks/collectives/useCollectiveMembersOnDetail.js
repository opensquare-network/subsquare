import { useDetailType } from "../../../context/page";
import { useChain } from "../../../context/chain";
import toApiCouncil from "../../toApiCouncil";
import useCollectiveMembers from "./useCollectiveMembers";

// Get collective members on detail page
export default function useCollectiveMembersOnDetail() {
  const type = useDetailType();
  const chain = useChain();
  const moduleName = toApiCouncil(chain, type)

  return useCollectiveMembers(moduleName);
}
