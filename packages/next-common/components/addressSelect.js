import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { useState, useRef } from "react";
import useOnClickOutside from "../utils/hooks/useOnClickOutside.js";
import Avatar from "./avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import { encodeAddressToChain } from "../services/address";
import { fetchIdentity } from "../services/identity";
import Identity from "./Identity";
import Caret from "./icons/caret";
import { addressEllipsis } from "../utils";
import PseudoAvatar from "../assets/imgs/pesudoAvatar.svg";
import { useChain } from "../context/chain";
import { normalizeChainAddress } from "next-common/utils/address.js";
import getChainSettings from "next-common/utils/consts/settings/index.js";

const Wrapper = Relative;

const Select = styled(Flex)`
  background: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 8px;
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
  > img:first-child {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
  }
  > img:last-child {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    margin-left: auto;
  }
  ${(props) =>
    props.disabled &&
    css`
      background: var(--neutral200);
      pointer-events: none;
    `};
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

const Options = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 4px;
  padding: 8px 0;
  background: var(--neutral100);
  box-shadow: var(--shadow200);
  border: 1px solid var(--neutral300);
  border-radius: 8px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 1;
`;

const Item = styled(Flex)`
  background: var(--neutral100);
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
  > img:first-child {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
  }
  :hover {
    background: var(--neutral200);
  }
  ${(props) =>
    props?.theme.isDark &&
    css`
      :hover,
      :hover div {
        background: var(--neutral300);
      }
    `};
  ${(p) =>
    p.selected &&
    css`
      background: var(--neutral200);
    `}
`;

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
