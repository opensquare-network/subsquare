import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProfileAssetsList from "./assetsList";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { usePageProps } from "next-common/context/page";
import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import AssetHubTabs from "next-common/components/assets/tabs/index";
import AssetsTransfersHistory from "next-common/components/assets/transferHistory/index";
import { AssetHubTabsProvider } from "next-common/components/assets/context/assetHubTabsProvider";
import { useChain } from "next-common/context/chain";
import { isAssetHubChain } from "next-common/utils/chain";

function ProfileAssetsInContext() {
  const chain = useChain();
  const { id } = usePageProps();
  const router = useRouter();
  const maybeEvmAddress = tryConvertToEvmAddress(id);

  let pathname = `/user/${maybeEvmAddress}/assets`;
  if (isAssetHubChain(chain)) {
    pathname = `/assethub/${pathname}`;
  }

  useEffect(() => {
    router.push(
      {
        pathname,
      },
      undefined,
      { shallow: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maybeEvmAddress, pathname]);

  return (
    <div className="flex flex-col gap-[16px]">
      <SecondaryCard>
        <ProfileAssetsList address={id} />
      </SecondaryCard>
    </div>
  );
}

function ProfileTransfers() {
  const { id } = usePageProps();

  return (
    <div>
      <SecondaryCard>
        <AssetsTransfersHistory address={id} />
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
