import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import AllAssetsList from "next-common/components/assets/allAssetsList";
import { withCommonProps } from "next-common/lib";

export default function AssetsPage() {
  return (
    <AssetMetadataProvider>
      <AllAssetsList />
    </AssetMetadataProvider>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  return {
    props: {},
  };
});
