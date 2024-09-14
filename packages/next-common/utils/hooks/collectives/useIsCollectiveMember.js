import useCollectiveMembers from "./useCollectiveMembers";
import useRealAddress from "../useRealAddress";
import { isAddressInGroup } from "../../index";

export default function useIsCollectiveMember(pallet) {
  const { members, loading } = useCollectiveMembers(pallet);
  const realAddress = useRealAddress();

  return {
    isMember: isAddressInGroup(realAddress, members),
    loading,
  };
}
