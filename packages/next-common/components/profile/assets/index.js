import useMyAssets from "next-common/components/assets/useMyAssets";
import { Title } from "next-common/components/assets/walletAssetList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProfileAssetsList from "./assetsList";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { usePageProps } from "next-common/context/page";
import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";

function ProfileAssetsInContext() {
  const { id } = usePageProps();
  const router = useRouter();
  const maybeEvmAddress = tryConvertToEvmAddress(id);

  useEffect(() => {
    router.push(
      {
        pathname: `/user/${maybeEvmAddress}/assets`,
      },
      undefined,
      { shallow: true },
    );
  }, [maybeEvmAddress]);

  const assets = useMyAssets();

  return (
    <div className="flex flex-col gap-[16px]">
      <Title assetsCount={assets && assets.length} />
      <SecondaryCard>
        <ProfileAssetsList assets={assets} />
      </SecondaryCard>
    </div>
  );
}

export default function ProfileAssets() {
  return (
    <AssetMetadataProvider>
      <ProfileAssetsInContext />
    </AssetMetadataProvider>
  );
}
