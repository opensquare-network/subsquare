import useCollectiveMembers from "./useCollectiveMembers";
import useRealAddress from "../useRealAddress";
import { isAddressInGroup } from "../../index";

export default function useIsCollectiveMember(moduleName) {
  const { members, loading } = useCollectiveMembers(moduleName);
  const realAddress = useRealAddress();

  return {
    isMember: isAddressInGroup(realAddress, members),
    loading,
  };
}
