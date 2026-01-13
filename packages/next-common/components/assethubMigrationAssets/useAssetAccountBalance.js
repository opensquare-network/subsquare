import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useAssetAccountBalance(assetId, address) {
  const { loading, result } = useSubStorage("assets", "account", [
    assetId,
    address,
  ]);

  if (loading) {
    return { loading: true, balance: null, transferrable: null };
  }

  if (!result || result.isNone) {
    return { loading: false, balance: null, transferrable: null };
  }

  const unwrapped = result.unwrap();
  const balance =
    unwrapped.balance?.toJSON?.() || unwrapped.balance?.toString() || "0";
  const isFrozen = unwrapped.status?.isFrozen;
  const transferrable = isFrozen ? "0" : balance;

  return { loading: false, balance, transferrable };
}
