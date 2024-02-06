import React from "react";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import AccountLinks from "next-common/components/links/accountLinks";
import AchainableProfile from "../achainableProfile";
import AssetInfo from "../assetInfo";
import KintAssetInfo from "../assetInfo/kint";
import { Wrapper } from "./styled";
import DisplayUserAvatar from "./displayUserAvatar";
import DisplayUser from "./displayUser";
import DisplayUserAddress from "./displayUserAddress";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";

export default function Bio({ address, user, id }) {
  const { showAchainableLabels } = useChainSettings();
  const chain = useChain();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  return (
    <Wrapper>
      <DisplayUserAvatar address={address} user={user} />
      <div className="flex flex-col items-center mt-0 flex-wrap w-full">
        <DisplayUser id={id} />
        <DisplayUserAddress address={address} />
        {isPolkadotAddress(address) && (
          <div className="mt-[8px]">
            <AccountLinks address={address} />
          </div>
        )}
        {isKintsugi ? (
          <KintAssetInfo address={address} />
        ) : (
          <AssetInfo address={address} />
        )}
      </div>
      {showAchainableLabels && <AchainableProfile id={id} />}
    </Wrapper>
  );
}
