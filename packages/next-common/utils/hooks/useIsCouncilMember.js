import { isSameAddress } from "..";
import useCouncilMembers from "./useCouncilMembers";
import useRealAddress from "./useRealAddress";

export default function useIsCouncilMember() {
  const realAddress = useRealAddress();
  const councilTippers = useCouncilMembers();
  return councilTippers?.some((address) => isSameAddress(realAddress, address));
}
