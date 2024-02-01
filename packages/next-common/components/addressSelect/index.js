import React, { useEffect, useState, useRef } from "react";
import useOnClickOutside from "next-common/utils/hooks/useOnClickOutside.js";
import Avatar from "next-common/components/avatar";
import { encodeAddressToChain } from "next-common/services/address";
import { fetchIdentity } from "next-common/services/identity";
import Identity from "next-common/components/Identity";
import Caret from "next-common/components/icons/caret";
import { addressEllipsis } from "next-common/utils";
import PseudoAvatar from "next-common/assets/imgs/pesudoAvatar.svg";
import { useChain } from "next-common/context/chain";
import { normalizeChainAddress } from "next-common/utils/address.js";
import getChainSettings from "next-common/utils/consts/settings/index.js";
import { Item, NameWrapper, Options, Select, Wrapper } from "./styled.js";

function AccountDisplay({ name, address, identity }) {
  return (
    <>
      <Avatar address={address} />
      <NameWrapper>
        {identity && identity?.info?.status !== "NO_ID" ? (
          <>
            <Identity identity={identity} />
            <div>{addressEllipsis(address)}</div>
          </>
        ) : (
          <>
            <div>{name}</div>
            <div>{addressEllipsis(address) ?? "--"}</div>
          </>
        )}
      </NameWrapper>
    </>
  );
}

function ChainAccount({ chain, account }) {
  const settings = getChainSettings(chain);
  const [identity, setIdentity] = useState(null);
  const normalizedAddr = normalizeChainAddress(chain, account?.address);

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
    <AccountDisplay
      name={account?.name}
      address={normalizedAddr}
      identity={identity}
    />
  );
}

function Account({ account }) {
  const chain = useChain();
  return <ChainAccount chain={chain} account={account} />;
}

function EmptyAccount() {
  return (
    <>
      <PseudoAvatar />
      <AccountDisplay address={"--"} name={"--"} />
    </>
  );
}

export function ChainOption({ chain, onClick, item, selected }) {
  return (
    <Item onClick={onClick} selected={selected}>
      <ChainAccount chain={chain} account={item} />
    </Item>
  );
}

export function Option({ onClick, item, selected }) {
  return (
    <Item onClick={onClick} selected={selected}>
      <Account account={item} />
    </Item>
  );
}

export function ChainAddressSelect({
  chain,
  accounts,
  selectedAccount,
  onSelect,
  disabled,
}) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <Select
        onClick={() => setShow(!show)}
        disabled={disabled || accounts?.length === 0}
      >
        {selectedAccount ? (
          <ChainAccount chain={chain} account={selectedAccount} />
        ) : (
          <EmptyAccount />
        )}
        <Caret down={!show} />
      </Select>
      {show && (
        <Options className="scrollbar-pretty">
          {(accounts || []).map((item, index) => (
            <ChainOption
              key={index}
              chain={chain}
              onClick={() => {
                onSelect(item);
                setShow(false);
              }}
              item={item}
              selected={
                item.address === selectedAccount?.address &&
                item.meta?.source === selectedAccount.meta?.source
              }
            />
          ))}
        </Options>
      )}
    </Wrapper>
  );
}

export default function AddressSelect({
  accounts,
  selectedAccount,
  onSelect,
  disabled,
}) {
  const chain = useChain();
  return (
    <ChainAddressSelect
      chain={chain}
      accounts={accounts}
      selectedAccount={selectedAccount}
      onSelect={onSelect}
      disabled={disabled}
    />
  );
}
