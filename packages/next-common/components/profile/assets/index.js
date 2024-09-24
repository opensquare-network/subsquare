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
import {
  AssetHubTabsProvider,
  useTotalCounts,
} from "next-common/components/assets/context/assetHubTabsProvider";

function ProfileAssetsInContext() {
  const { id } = usePageProps();
  const router = useRouter();
  const maybeEvmAddress = tryConvertToEvmAddress(id);
  const [, setTotalCount] = useTotalCounts();

  useEffect(() => {
    router.push(
      {
        pathname: `/user/${maybeEvmAddress}/assets`,
      },
      undefined,
      { shallow: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maybeEvmAddress]);

  const assets = useMyAssets();

  useEffect(() => {
    if (assets && setTotalCount) {
      const count = assets ? assets.length : 0;
      setTotalCount("assets", count);
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

function ProfileTransfers() {
  return (
    <div>
      <SecondaryCard>
        <AssetsTransfersHistory />
      </SecondaryCard>
    </div>
  );
}

export default function ProfileAssets() {
  return (
    <AssetHubTabsProvider>
      <AssetMetadataProvider>
        <div className="flex flex-col gap-[16px]">
          <AssetHubTabs>
            <ProfileAssetsInContext />
            <ProfileTransfers />
          </AssetHubTabs>
        </div>
      </AssetMetadataProvider>
    </AssetHubTabsProvider>
  );
}
