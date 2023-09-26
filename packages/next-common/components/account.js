import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import Avatar from "./avatar";
import { encodeAddressToChain } from "../services/address";
import { fetchIdentity } from "../services/identity";
import Identity from "./Identity";
import { addressEllipsis } from "../utils";
import { useChainSettings } from "../context/chain";
import { normalizeAddress } from "next-common/utils/address";
import {
  WalletPolkadotjs,
  WalletMetamask,
  WalletTailsman,
  WalletSubwallet,
  WalletPolkagate,
  WalletNova,
} from "@osn/icons/subsquare";
import WalletTypes from "next-common/utils/consts/walletTypes";

const WalletIcon = ({ wallet }) => {
  return (
    <div className="absolute right-0 bottom-0">
      {wallet === WalletTypes.POLKADOT_JS && (
        <WalletPolkadotjs width={16} height={16} />
      )}
      {wallet === WalletTypes.METAMASK && (
        <WalletMetamask width={16} height={16} />
      )}
      {wallet === WalletTypes.TALISMAN && (
        <WalletTailsman width={16} height={16} />
      )}
      {wallet === WalletTypes.SUBWALLET_JS && (
        <WalletSubwallet width={16} height={16} />
      )}
      {wallet === WalletTypes.POLKAGATE && (
        <WalletPolkagate width={16} height={16} />
      )}
      {wallet === WalletTypes.NOVA && <WalletNova width={16} height={16} />}
    </div>
  );
};

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const NameWrapper = styled.div`
  color: var(--textPrimary);
  flex-grow: 1;
  > :first-child {
    font-size: 14px;
    font-weight: 500;
  }
  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: var(--textTertiary);
  }
`;

export default function Account({ account }) {
  const settings = useChainSettings();
  const [identity, setIdentity] = useState(null);

  const address = normalizeAddress(account?.address);
  const wallet = account?.meta?.source;

  useEffect(() => {
    setIdentity(null);
    if (account?.address) {
      fetchIdentity(
        settings.identity,
        encodeAddressToChain(account.address, settings.identity),
      ).then((identity) => setIdentity(identity));
    }
  }, [account?.address, settings]);

  return (
    <>
      <AvatarWrapper>
        <Avatar address={address} size={40} />
        <WalletIcon wallet={wallet} />
      </AvatarWrapper>
      <NameWrapper>
        {/*TODO: use <IdentityOrAddr> after PR merged*/}
        {identity && identity?.info?.status !== "NO_ID" ? (
          <>
            <Identity identity={identity} />
            <div>{addressEllipsis(address)}</div>
          </>
        ) : (
          <>
            <div className="text-textPrimary">{account?.name}</div>
            <div>{addressEllipsis(address) ?? "--"}</div>
          </>
        )}
      </NameWrapper>
    </>
  );
}
