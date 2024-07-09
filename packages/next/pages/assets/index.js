import { withCommonProps } from "next-common/lib";
import Chains from "next-common/utils/consts/chains";

export default function AssetHubPage() {
  return "assets page";
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
