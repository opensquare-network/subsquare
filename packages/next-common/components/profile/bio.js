import React from "react";
import styled from "styled-components";
import { isPolkadotAddress } from "../../utils/viewfuncs";
import User from "../user";
import Avatar from "../avatar";
import Gravatar from "../gravatar";
import Flex from "../styled/flex";
import AccountLinks from "../links/accountLinks";
import { isEthereumAddress } from "@polkadot/util-crypto";
import AchainableProfile from "./achainableProfile";
import { useChainSettings } from "next-common/context/chain";

const BioWrapper = styled.div`
  padding: 24px;
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

const DisplayUserAvatar = ({ address, user }) => {
  return address ? (
    <Avatar address={address} size={48} />
  ) : (
    <Gravatar emailMd5={user?.emmailMd5} size={48} />
  );
};

const DisplayUser = ({ id }) => {
  if (isPolkadotAddress(id) || isEthereumAddress(id)) {
    return <User add={id} showAvatar={false} fontSize={16} />;
  }

  return <Username>{id}</Username>;
};

const DisplayUserAddress = ({ address }) => {
  if (!address) {
    return null;
  }
  return (
    <AddressWrapper>
      <Tertiary>{address}</Tertiary>
      {!isEthereumAddress(address) && <AccountLinks address={address} />}
    </AddressWrapper>
  );
};

export default function Bio({ address, user, id }) {
  const { showAchainableLabels } = useChainSettings();

  return (
    <BioWrapper>
      <DisplayUserAvatar address={address} user={user} />
      <Flex
        style={{
          flexDirection: "column",
          alignItems: "center",
          marginTop: 0,
          flexWrap: "wrap",
        }}
      >
        <DisplayUser id={id} />
        <DisplayUserAddress address={address} />
      </Flex>
      {showAchainableLabels && <AchainableProfile id={id} />}
    </BioWrapper>
  );
}
