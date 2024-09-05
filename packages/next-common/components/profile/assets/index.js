import useMyAssets from "next-common/components/assets/useMyAssets";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProfileAssetsList from "./assetsList";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { usePageProps } from "next-common/context/page";
import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import AssetHubTabs from "next-common/components/assets/tabs/index";
import AssetsTransfersHistory from "next-common/components/assets/transferHistory/index";

function ProfileAssetsInContext({ setTotalCount }) {
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
  }, [maybeEvmAddress, router]);

  const assets = useMyAssets();

  useEffect(() => {
    if (assets && setTotalCount) {
      const count = assets ? assets.length : 0;
      setTotalCount(count);
    }
  }, [assets, setTotalCount]);

  return (
    <div className="flex flex-col gap-[16px]">
      <SecondaryCard>
        <ProfileAssetsList assets={assets} />
      </SecondaryCard>
    </div>
  );
}

function ProfileTransfers({ setTotalCount }) {
  return (
    <div>
      <SecondaryCard>
        <AssetsTransfersHistory setTotalCount={setTotalCount} />
      </SecondaryCard>
    </div>
  );
}

export default function ProfileAssets() {
  return (
    <AssetMetadataProvider>
      <div className="flex flex-col gap-[16px]">
        <AssetHubTabs>
          <ProfileAssetsInContext />
          <ProfileTransfers />
        </AssetHubTabs>
      </div>
    </AssetMetadataProvider>
  );
}
