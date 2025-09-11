import AllAssetsList from "next-common/components/assets/allAssetsList";
import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import { withCommonProps } from "next-common/lib";
import { AssetHubPageProvider, isAssetHubSupported } from "./";

export default function AssetHubAssetsPage() {
  return (
    <AssetHubPageProvider>
      <AssetHubAssetsPageImpl />
    </AssetHubPageProvider>
  );
}

function AssetHubAssetsPageImpl() {
  return (
    <AssetMetadataProvider>
      <AllAssetsList />
    </AssetMetadataProvider>
  );
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
