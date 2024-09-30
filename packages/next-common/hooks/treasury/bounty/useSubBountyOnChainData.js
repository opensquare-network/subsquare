import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubParentBountyOnChainData(bountyId) {
  const { result, loading } = useSubStorage("bounties", "bounties", [bountyId]);
  const data = result?.toJSON();
  return {
    data,
    loading,
  };
}
