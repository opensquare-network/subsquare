import useAccountInfo from "next-common/hooks/useAccountInfo";
import useOnChainAccountData from "next-common/hooks/useOnChainAccountData";
import AssetDisplay from "./assetDisplay";

export default function AssetInfo({ address }) {
  const accountData = useOnChainAccountData(address);
  const accountInfo = useAccountInfo(accountData);

  if (!accountInfo) {
    return null;
  }

  return <AssetDisplay accountInfo={accountInfo} />;
}
