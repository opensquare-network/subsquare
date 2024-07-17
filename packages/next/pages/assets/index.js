import { useChainSettings } from "next-common/context/chain";
import usePageTitle from "next-common/hooks/usePageTitle";
import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import AllAssetsList from "next-common/components/assets/allAssetsList";

export default function AssetsPage() {
  const chainSettings = useChainSettings();
  const seoTitle = usePageTitle("AssetHub platform");
  const seoInfo = {
    title: "Subsquare | " + seoTitle,
    desc: chainSettings.description,
  };

  return (
    <AssetMetadataProvider>
      <AllAssetsList seoInfo={seoInfo} />
    </AssetMetadataProvider>
  );
}
