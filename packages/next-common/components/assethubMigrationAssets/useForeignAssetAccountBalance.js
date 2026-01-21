import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useForeignAssetAccountBalance(asset, address) {
  const { location } = asset;
  const { loading, result } = useSubStorage("foreignAssets", "account", [
    location,
    address,
  ]);

  if (loading) {
    return { loading: true, balance: null, transferable: null };
  }

  if (!result || result.isNone) {
    return { loading: false, balance: null, transferable: null };
  }

  const unwrapped = result.unwrap();
  const balance =
    unwrapped.balance?.toJSON?.() || unwrapped.balance?.toString() || "0";
  const isFrozen = unwrapped.status?.isFrozen;
  const transferable = isFrozen ? "0" : balance;

  return { loading: false, balance, transferable };
}
