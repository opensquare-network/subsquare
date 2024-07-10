import { withCommonProps } from "next-common/lib";
import { useChainSettings } from "next-common/context/chain";
import usePageTitle from "next-common/hooks/usePageTitle";
import Chains from "next-common/utils/consts/chains";
import NoWalletConnected from "components/assets/noWalletConnected";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import WalletAssetList from "components/assets/walletAssetList";

function AssetsContent({ seoInfo }) {
  const address = useRealAddress();

  if (!address) {
    return <NoWalletConnected seoInfo={seoInfo} />;
  }

  return <WalletAssetList seoInfo={seoInfo} />;
}

export default function AssetsPage() {
  const chainSettings = useChainSettings();
  const seoTitle = usePageTitle("AssetHub platform");
  const seoInfo = {
    title: "Subsquare | " + seoTitle,
    desc: chainSettings.description,
  };

  return <AssetsContent seoInfo={seoInfo} />;
}

export const getServerSideProps = withCommonProps(async () => {
  const chain = process.env.CHAIN;
  if (Chains.polkadotAssetHub !== chain) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }
});
