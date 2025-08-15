import AllForeignAssetsList from "next-common/components/assets/allForeignAssetsList";
import { withCommonProps } from "next-common/lib";
import { AssetHubPageProvider, isAssetHubSupported } from "./";

export default function AssetHubForeignAssetsPage() {
  return (
    <AssetHubPageProvider>
      <AssetHubForeignAssetsPageImpl />
    </AssetHubPageProvider>
  );
}

function AssetHubForeignAssetsPageImpl() {
  return <AllForeignAssetsList />;
}

export const getServerSideProps = async (ctx) => {
  if (!isAssetHubSupported) {
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
