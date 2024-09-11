import styled from "styled-components";
import { isPolkadotAddress } from "../../utils/viewfuncs";
import Flex from "../styled/flex";
import AccountLinks from "../links/accountLinks";
import { isEthereumAddress } from "@polkadot/util-crypto";
import AchainableProfile from "./achainableProfile";
import { useChain, useChainSettings } from "next-common/context/chain";
import Copyable from "../copyable";
import AssetInfo from "./assetInfo";
import KintAssetInfo from "./assetInfo/kint";
import Chains from "next-common/utils/consts/chains";
import AddressUser from "../user/addressUser";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { AvatarDisplay } from "../user/avatarDisplay";
import FellowshipTagInfo from "./fellowshipTagInfo";

const Wrapper = styled.div`
  padding: 24px 0;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Username = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: var(--textPrimary);
`;

const AddressWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-basis: 100%;
  flex-wrap: wrap;
`;

const Tertiary = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--textTertiary);
`;

const DisplayUserAvatar = ({ address, user }) => (
  <AvatarDisplay
    avatarCid={user?.avatarCid}
    address={address}
    emailMd5={user?.emailMd5}
    size={48}
  />
);

const DisplayUser = ({ id }) => {
  if (isPolkadotAddress(id) || isEthereumAddress(id)) {
    return (
      <AddressUser
        add={id}
        showAvatar={false}
        addressClassName={"!text16Bold"}
      />
    );
  }

  return <Username>{id}</Username>;
};

const DisplayUserAddress = ({ address }) => {
  if (!address) {
    return null;
  }
  const maybeEvmAddress = tryConvertToEvmAddress(address);
  return (
    <AddressWrapper>
      <Copyable copyText={maybeEvmAddress}>
        <Tertiary>{maybeEvmAddress}</Tertiary>
      </Copyable>
      {!isEthereumAddress(maybeEvmAddress) && (
        <AccountLinks address={maybeEvmAddress} />
      )}
    </AddressWrapper>
  );
};

export default function Bio() {
  const { user, id } = usePageProps();
  const { showAchainableLabels } = useChainSettings();
  const chain = useChain();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;

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

        <FellowshipTagInfo address={address} />
        <FellowshipTagInfo
          address={address}
          pallet="ambassadorCollective"
          type="ambassador"
        />

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
