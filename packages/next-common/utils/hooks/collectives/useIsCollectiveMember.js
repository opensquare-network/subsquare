import useCollectiveMembers from "./useCollectiveMembers";
import useRealAddress from "../useRealAddress";
import { isAddressInGroup } from "../../index";

export default function useIsCollectiveMember(moduleName) {
  const { members } = useCollectiveMembers(moduleName);
  const realAddress = useRealAddress();

  return isAddressInGroup(realAddress, members);
}
