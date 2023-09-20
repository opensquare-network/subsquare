import useAccountInfo from "next-common/hooks/useAccountInfo";
import AssetDisplay from "./assetDisplay";

export default function AssetInfo({ address }) {
  const accountInfo = useAccountInfo(address);

  if (!accountInfo) {
    return null;
  }

  return <AssetDisplay accountInfo={accountInfo} />;
}
