import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubAssetBalance(assetId, address) {
  const { result, loading } = useSubStorage("assets", "account", [
    assetId,
    address,
  ]);

  return {
    result: result?.toJSON()?.balance || 0,
    loading,
  };
}
