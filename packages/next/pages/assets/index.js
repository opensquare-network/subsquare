import { withCommonProps } from "next-common/lib";
import { useChainSettings } from "next-common/context/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import { HeadContent, TitleExtra } from "next-common/components/overview";
import Chains from "next-common/utils/consts/chains";

export default function HomePage() {
  const chainSettings = useChainSettings();

  return (
    <ListLayout
      title={chainSettings.name}
      titleExtra={<TitleExtra />}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<HeadContent />}
    ></ListLayout>
  );
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
