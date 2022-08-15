import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { useState, useRef } from "react";
import useOnClickOutside from "../utils/hooks/useOnClickOutside.js";
import Avatar from "./avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import { shadow_200 } from "../styles/componentCss";
import { encodeAddressToChain } from "../services/address";
import { nodes } from "../utils/constants";
import { fetchIdentity } from "../services/identity";
import Identity from "./Identity";
import Caret from "./icons/caret";
import { addressEllipsis } from "../utils";

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
  overflow-y: overlay;
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

function Account({ account, chain }) {
  const [identity, setIdentity] = useState(null);
  useEffect(() => {
    setIdentity(null);
    if (account.address) {
      const identity = nodes.find((n) => n.value === chain)?.identity;
      if (!identity) return;

      fetchIdentity(
        identity,
        encodeAddressToChain(account.address, identity)
      ).then((identity) => setIdentity(identity));
    }
  }, [account.address, chain]);

  return (
    <>
      <Avatar address={account.address} />
      <NameWrapper>
        {/*TODO: use <IdentityOrAddr> after PR merged*/}
        {identity && identity?.info?.status !== "NO_ID" ? (
          <>
            <Identity identity={identity} />
            <div>
              {addressEllipsis(encodeAddressToChain(account.address, chain))}
            </div>
          </>
        ) : (
          <>
            <div>{account?.name}</div>
            <div>
              {addressEllipsis(encodeAddressToChain(account.address, chain))}
            </div>
          </>
        )}
      </NameWrapper>
    </>
  );
}

export function Option({ onClick, item, selected, chain }) {
  return (
    <Item onClick={onClick} selected={selected}>
      <Account account={item} chain={chain} />
    </Item>
  );
}

export default function AddressSelect({
  chain,
  accounts,
  selectedAccount,
  onSelect,
}) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <Select onClick={() => setShow(!show)}>
        {selectedAccount && <Account account={selectedAccount} chain={chain} />}
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
              selected={item.address === selectedAccount?.address}
              chain={chain}
            />
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
