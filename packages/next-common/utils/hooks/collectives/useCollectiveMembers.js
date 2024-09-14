import { useCollectivePallet } from "next-common/context/collective";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useCollectiveMembers() {
  const pallet = useCollectivePallet();
  const { result, loading } = useSubStorage(pallet, "members");
  const members = result?.toJSON?.();

  return {
    members,
    loading,
  };
}
