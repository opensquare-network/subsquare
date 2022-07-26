import React from "react";
import styled, { css } from "styled-components";
import { useState, useRef } from "react";
import useOnClickOutside from "../utils/hooks/useOnClickOutside.js";
import { addressEllipsis } from "utils";
import Avatar from "./avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import { shadow_200 } from "../styles/componentCss";
import { encodeAddressToChain } from "../services/address";
import { isAddress } from "@polkadot/util-crypto";
import Caret from "./icons/caret";

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

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.grey400Border};
    border-right: 4px solid white;
  }
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
  ${(p) =>
    p.selected &&
    css`
      background: ${(props) => props.theme.grey100Bg};
    `}
`;

const Input = styled.input`
  all: unset;
  display: flex;
  flex-grow: 1;
  border: none;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;

  color: ${(props) => props.theme.textPrimary};

  margin: 4px 16px;
`;

export default function AddressCombo({ chain, accounts, address, setAddress }) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [inputAddress, setInputAddress] = useState(address);
  const ref = useRef();

  const selectedAccount = accounts.find(
    (item) => encodeAddressToChain(item.address, chain) === address
  );
  const shortAddr = addressEllipsis(address);

  const onBlur = () => {
    const isAddr = isAddress(inputAddress);
    if (isAddr) {
      const ss58Addr = encodeAddressToChain(inputAddress, chain);
      setAddress(ss58Addr);
      setInputAddress(ss58Addr);
      setEdit(false);
    } else {
      setAddress();
    }
  };

  useOnClickOutside(ref, () => {
    setShow(false);
  });

  let selectContent;

  if (edit) {
    selectContent = (
      <>
        <Avatar address={inputAddress} />
        <Input
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          onBlur={onBlur}
        />
      </>
    );
  } else if (selectedAccount) {
    selectContent = (
      <>
        <Avatar address={selectedAccount.address} />
        <NameWrapper>
          <div>{selectedAccount.name}</div>
          <div>{shortAddr}</div>
        </NameWrapper>
      </>
    );
  } else {
    selectContent = (
      <>
        <Avatar address={address} />
        <NameWrapper>
          <div>{shortAddr}</div>
          <div>{shortAddr}</div>
        </NameWrapper>
      </>
    );
  }

  const listOptions = (
    <Options>
      {(accounts || []).map((item, index) => {
        const ss58Address = encodeAddressToChain(item.address, chain);
        return (
          <Item
            key={index}
            onClick={() => {
              setAddress(ss58Address);
              setInputAddress(ss58Address);
              setEdit(false);
              setShow(false);
            }}
            selected={item.address === address}
          >
            <Avatar address={item.address} />
            <NameWrapper>
              <div>{item.name}</div>
              <div>{addressEllipsis(ss58Address)}</div>
            </NameWrapper>
          </Item>
        );
      })}
    </Options>
  );

  return (
    <Wrapper ref={ref}>
      <Select
        onClick={() => {
          setShow(true);
          setEdit(true);
          setTimeout(() => ref.current.querySelector("input")?.focus(), 100);
        }}
      >
        {selectContent}
        <span
          onClick={(e) => {
            setShow(!show);
            e.stopPropagation();
          }}
        >
          <Caret down={!show} />
        </span>
      </Select>
      {show && listOptions}
    </Wrapper>
  );
}
