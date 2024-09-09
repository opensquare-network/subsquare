import { useCollectivePallet } from "next-common/context/collective";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useCouncilMembers() {
  const pallet = useCollectivePallet();
  const { result } = useSubStorage(pallet, "members");

  return result?.toJSON();
}
