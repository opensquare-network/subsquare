import { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import { encodeAddressToChain } from "../services/address";
import { fetchIdentity } from "../services/identity";
import Identity from "./Identity";
import { addressEllipsis } from "../utils";
import { useChainSettings } from "../context/chain";
import { normalizeAddress } from "next-common/utils/address";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { allWallets } from "next-common/utils/consts/connect";
import { find } from "lodash-es";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { useConnectors } from "wagmi";
import AddressAvatar from "./user/addressAvatar";

function WalletIcon({ wallet: walletName }) {
  const wallet = find(allWallets, { extensionName: walletName });

  return (
    wallet?.logo && (
      <wallet.logo className="absolute right-0 bottom-0 w-4 h-4" />
    )
  );
}

function EvmWalletIcon({ id, wallet }) {
  const connectors = useConnectors();
  let connector = find(connectors, { id });
  // mixed chain talisman
  if (!connector) {
    connector = find(
      connectors,
      (c) => c.name.toLowerCase() === wallet?.toLowerCase?.(),
    );
  }

  return <WalletIcon wallet={connector?.name?.toLowerCase?.()} />;
}

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
  const maybeEvmAddress = tryConvertToEvmAddress(address);
  const wallet = account?.meta?.source;

  const isEthereum = account?.type === ChainTypes.ETHEREUM;

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
        <AddressAvatar address={address} size={40} />
        {isEthereum ? (
          <EvmWalletIcon id={account?.meta?.connectorId} wallet={wallet} />
        ) : (
          <WalletIcon wallet={wallet} />
        )}
      </AvatarWrapper>
      <NameWrapper>
        {/*TODO: use <IdentityOrAddr> after PR merged*/}
        {identity && identity?.info?.status !== "NO_ID" ? (
          <>
            <Identity identity={identity} />
            <div>{addressEllipsis(maybeEvmAddress)}</div>
          </>
        ) : (
          <>
            <div className="text-textPrimary">{account?.name}</div>
            <div>{addressEllipsis(maybeEvmAddress) ?? "--"}</div>
          </>
        )}
      </NameWrapper>
    </>
  );
}
