import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { useState, useRef } from "react";
import useOnClickOutside from "../utils/hooks/useOnClickOutside.js";
import Avatar from "./avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import { pretty_scroll_bar, shadow_200 } from "../styles/componentCss";
import { encodeAddressToChain } from "../services/address";
import { fetchIdentity } from "../services/identity";
import Identity from "./Identity";
import Caret from "./icons/caret";
import { addressEllipsis } from "../utils";
import PseudoAvatar from "../assets/imgs/pesudoAvatar.svg";
import { useChainSettings } from "../context/chain";
import { normalizeAddress } from "next-common/utils/address.js";

const Wrapper = Relative;

const Select = styled(Flex)`
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-radius: 4px;
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
      background: ${props.theme.grey100Bg};
      pointer-events: none;
    `};
`;

const NameWrapper = styled.div`
  flex-grow: 1;
  > :first-child {
    font-size: 14px;
    font-weight: 500;
  }
  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: ${(props) => props.theme.textTertiary};
  }
`;

const Options = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 4px;
  padding: 8px 0;
  background: ${(props) => props.theme.neutral};
  ${shadow_200};
  border-radius: 4px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 1;

  ${pretty_scroll_bar};
`;

const Item = styled(Flex)`
  background: ${(props) => props.theme.neutral};
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
    background: ${(props) => props.theme.grey100Bg};
  }
  ${(props) =>
    props?.theme.isDark &&
    css`
      :hover,
      :hover div {
        background: ${(props) => props.theme.grey200Border};
      }
    `};
  ${(p) =>
    p.selected &&
    css`
      background: ${(props) => props.theme.grey100Bg};
    `}
`;

function Account({ account }) {
  const settings = useChainSettings();
  const [identity, setIdentity] = useState(null);
  const normalizedAddr = normalizeAddress(account?.address);

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
      <Avatar address={normalizedAddr} />
      <NameWrapper>
        {/*TODO: use <IdentityOrAddr> after PR merged*/}
        {identity && identity?.info?.status !== "NO_ID" ? (
          <>
            <Identity identity={identity} />
            <div>
              {addressEllipsis(normalizedAddr)}
            </div>
          </>
        ) : (
          <>
            <div>{account?.name}</div>
            <div>
              {addressEllipsis(normalizedAddr) ?? "--"}
            </div>
          </>
        )}
      </NameWrapper>
    </>
  );
}

function EmptyAccount() {
  return (
    <>
      <PseudoAvatar />
      <Account
        account={{
          address: "--",
          name: "--",
        }}
      />
    </>
  );
}

export function Option({ onClick, item, selected }) {
  return (
    <Item onClick={onClick} selected={selected}>
      <Account account={item} />
    </Item>
  );
}

export default function AddressSelect({
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
          <Account account={selectedAccount} />
        ) : (
          <EmptyAccount />
        )}
        <Caret down={!show} />
      </Select>
      {show && (
        <Options>
          {(accounts || []).map((item, index) => (
            <Option
              key={index}
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
