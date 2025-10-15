import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import WalletAssetList from "next-common/components/assets/walletAssetList";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import { withCommonProps } from "next-common/lib";
import useExistentialDeposit from "next-common/utils/hooks/chain/useExistentialDeposit";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

export default function AssetHubPage() {
  const realAddress = useRealAddress();
  useExistentialDeposit();

  if (!realAddress) {
    return <NoWalletConnected />;
  }

  return (
    <AssetMetadataProvider>
      {/* Remove useRelayChainApi (Polkadot AHM completed) */}
      <RelayChainApiProvider>
        <WalletAssetList />
      </RelayChainApiProvider>
    </AssetMetadataProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isAssetHubMigrated()) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    return {
      props: {},
    };
  })(ctx);
};
