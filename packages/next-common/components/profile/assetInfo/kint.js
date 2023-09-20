import AssetDisplay from "./assetDisplay";
import useKintAccountInfo from "next-common/hooks/useKintAccountInfo";

export default function KintAssetInfo({ address }) {
  const accountInfo = useKintAccountInfo(address);

  if (!accountInfo) {
    return null;
  }

  return <AssetDisplay accountInfo={accountInfo} />;
}
