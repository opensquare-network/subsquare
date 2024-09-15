import useCollectiveMembers from "./useCollectiveMembers";
import useRealAddress from "../useRealAddress";
import { isAddressInGroup } from "../../index";

export default function useIsCollectiveMember() {
  const { members, loading } = useCollectiveMembers();
  const realAddress = useRealAddress();

  return {
    isMember: isAddressInGroup(realAddress, members),
    loading,
  };
}
