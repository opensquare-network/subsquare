import AssetDisplay from "./assetDisplay";
import useKintOnChainAccountData from "next-common/hooks/useKintOnChainAccountData";
import useKintAccountInfo from "next-common/hooks/useKintAccountInfo";

export default function KintAssetInfo({ address }) {
  const accountData = useKintOnChainAccountData(address);
  const accountInfo = useKintAccountInfo(accountData);

  if (!accountInfo) {
    return null;
  }

  return <AssetDisplay accountInfo={accountInfo} />;
}
