import React from "react";
import Flex from "next-common/components/styled/flex";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import AchainableProfile from "../achainableProfile";
import AssetInfo from "../assetInfo";
import KintAssetInfo from "../assetInfo/kint";
import { Wrapper } from "./styled";
import DisplayUserAvatar from "./displayUserAvatar";
import DisplayUser from "./displayUser";
import DisplayUserAddress from "./displayUserAddress";

export default function Bio({ address, user, id }) {
  const { showAchainableLabels } = useChainSettings();
  const chain = useChain();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  return (
    <Wrapper>
      <DisplayUserAvatar address={address} user={user} />
      <Flex
        style={{
          flexDirection: "column",
          alignItems: "center",
          marginTop: 0,
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <DisplayUser id={id} />
        <DisplayUserAddress address={address} />
        {isKintsugi ? (
          <KintAssetInfo address={address} />
        ) : (
          <AssetInfo address={address} />
        )}
      </Flex>
      {showAchainableLabels && <AchainableProfile id={id} />}
    </Wrapper>
  );
}
