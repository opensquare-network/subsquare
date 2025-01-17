import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
import Avatar from "./avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import Identity from "./Identity";
import Caret from "./icons/caret";
import { addressEllipsis, isSameAddress } from "../utils";
import PseudoAvatar from "../assets/imgs/pesudoAvatar.svg";
import { normalizeAddress } from "next-common/utils/address.js";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useClickAway } from "react-use";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";

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

function Account({ account }) {
  const { identity, hasIdentity } = useIdentityInfo(account?.address);
  const normalizedAddr = normalizeAddress(account?.address);
  const maybeEvmAddress = tryConvertToEvmAddress(normalizedAddr);
  const shortAddr = addressEllipsis(maybeEvmAddress);

  return (
    <>
      <Avatar address={maybeEvmAddress} />
      <NameWrapper>
        {/*TODO: use <IdentityOrAddr> after PR merged*/}
        {hasIdentity ? (
          <>
            <Identity identity={identity} />
            <div>{shortAddr}</div>
          </>
        ) : (
          <>
            <div>{account?.name || shortAddr}</div>
            <div>{shortAddr ?? "--"}</div>
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

  useClickAway(ref, () => setShow(false));

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
        <Options className="scrollbar-pretty">
          {(accounts || []).map((item, index) => (
            <Option
              key={index}
              onClick={() => {
                onSelect(item);
                setShow(false);
              }}
              item={item}
              selected={
                isSameAddress(item.address, selectedAccount?.address) &&
                item.meta?.source === selectedAccount.meta?.source
              }
            />
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
