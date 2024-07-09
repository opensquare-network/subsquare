import { withCommonProps } from "next-common/lib";
import { useChainSettings } from "next-common/context/chain";
import usePageTitle from "next-common/hooks/usePageTitle";
import BaseLayout from "next-common/components/layout/baseLayout";
import Chains from "next-common/utils/consts/chains";

export default function AssetsPage() {
  const chainSettings = useChainSettings();
  const seoTitle = usePageTitle("AssetHub platform");
  const seoInfo = {
    title: "Subsquare | " + seoTitle,
    desc: chainSettings.description,
  };

  return <BaseLayout seoInfo={seoInfo}></BaseLayout>;
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
