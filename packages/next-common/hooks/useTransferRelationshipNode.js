import { useAsync } from "react-use";
import { EMPTY_RESULT } from "./useRelationshipNode";

export default function useTransferRelationshipNode(sourceAddress) {
  const { value, loading } = useAsync(async () => {
    if (!sourceAddress) {
      return EMPTY_RESULT;
    }
    const res = await fetch(
      `https://polkadot.api.followthedot.live:11200/account/${sourceAddress}/graph`,
    );
    const result = await res.json();
    return result;
  }, [sourceAddress]);

  return {
    loading,
    nodes: value?.accounts || [],
    edges: value?.transferVolumes || [],
  };
}
