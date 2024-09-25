import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import WalletAssetList from "next-common/components/assets/walletAssetList/index";
import { AssetMetadataProvider } from "./context/assetMetadata";
import { RelayChainApiProvider } from "next-common/context/polkadotApi";
import useExistentialDeposit from "next-common/utils/hooks/chain/useExistentialDeposit";

export default function AssetHubOverviewPage() {
  const address = useRealAddress();
  useExistentialDeposit();

  if (!address) {
    return <NoWalletConnected />;
  }

  return (
    <AssetMetadataProvider>
      <RelayChainApiProvider>
        <WalletAssetList />
      </RelayChainApiProvider>
    </AssetMetadataProvider>
  );
}
