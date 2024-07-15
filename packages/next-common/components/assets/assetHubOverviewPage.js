import { useChainSettings } from "next-common/context/chain";
import usePageTitle from "next-common/hooks/usePageTitle";
import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import WalletAssetList from "next-common/components/assets/walletAssetList";

export default function AssetHubOverviewPage() {
  const chainSettings = useChainSettings();
  const seoTitle = usePageTitle("AssetHub platform");
  const seoInfo = {
    title: "Subsquare | " + seoTitle,
    desc: chainSettings.description,
  };
  const address = useRealAddress();

  if (!address) {
    return <NoWalletConnected seoInfo={seoInfo} />;
  }

  return <WalletAssetList seoInfo={seoInfo} />;
}
