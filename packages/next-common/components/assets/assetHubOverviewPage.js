import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import WalletAssetList from "next-common/components/assets/walletAssetList";
import { AssetMetadataProvider } from "./context/assetMetadata";

export default function AssetHubOverviewPage() {
  const address = useRealAddress();

  if (!address) {
    return <NoWalletConnected />;
  }

  return (
    <AssetMetadataProvider>
      <WalletAssetList />
    </AssetMetadataProvider>
  );
}
