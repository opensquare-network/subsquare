import Copyable from "next-common/components/copyable";
import ListLayout from "next-common/components/layout/ListLayout";
import { useUser } from "next-common/context/user";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { isEthereumAddress } from "@polkadot/util-crypto";
import AccountLinks from "next-common/components/links/accountLinks";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import { addressEllipsis } from "next-common/utils";
import useAssets from "./useAssets";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "./assetsList";
import { isNil } from "lodash-es";

function HeadContent() {
  const address = useRealAddress();
  const user = useUser();

  const maybeEvmAddress = tryConvertToEvmAddress(address);

  return (
    <div className="flex flex-col gap-[16px]">
      <AvatarDisplay
        avatarCid={user?.avatarCid}
        address={address}
        emailMd5={user?.emailMd5}
        size={56}
      />
      <div className="flex flex-col gap-[4px]">
        <span className="text20Bold text-textPrimary">
          {addressEllipsis(address)}
        </span>
        <Copyable copyText={maybeEvmAddress}>
          <span className="text14Medium text-textTertiary">
            {maybeEvmAddress}
          </span>
        </Copyable>
        {!isEthereumAddress(maybeEvmAddress) && (
          <AccountLinks address={maybeEvmAddress} />
        )}
      </div>
    </div>
  );
}

export function Title({ assetsCount }) {
  return (
    <div className="flex mx-[24px] text16Bold gap-[4px]">
      <span className="text-textPrimary">Assets</span>
      {!isNil(assetsCount) && (
        <span className="text-textTertiary">{assetsCount || 0}</span>
      )}
    </div>
  );
}

export default function WalletAssetList({ seoInfo }) {
  const assets = useAssets();

  return (
    <ListLayout seoInfo={seoInfo} headContent={<HeadContent />}>
      <div className="flex flex-col gap-[16px]">
        <Title assetsCount={assets && assets.length} />
        <SecondaryCard>
          <AssetsList assets={assets} />
        </SecondaryCard>
      </div>
    </ListLayout>
  );
}
