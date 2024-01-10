import React, { useCallback, useEffect } from "react";
import styled, { css } from "styled-components";
import { useState, useRef } from "react";
import useOnClickOutside from "../utils/hooks/useOnClickOutside.js";
import Avatar from "./avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import { isAddress } from "@polkadot/util-crypto";
import Caret from "./icons/caret";
import { addressEllipsis } from "../utils";
import { normalizeAddress } from "next-common/utils/address.js";
import { fetchIdentity } from "next-common/services/identity.js";
import { useChainSettings } from "next-common/context/chain.js";
import { encodeAddressToChain } from "next-common/services/address.js";
import { getIdentityDisplay } from "next-common/utils/identity.js";
import IdentityIcon from "./Identity/identityIcon.js";

const Wrapper = Relative;

const Select = styled(Flex)`
  background: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
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
  border-radius: 4px;
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
  ${(p) =>
    p.selected &&
    css`
      background: var(--neutral200);
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

  color: var(--textPrimary);

  margin: 4px 16px;
`;

const IdentityName = styled.div`
  display: flex;
  gap: 4px;
`;

export default function AddressCombo({
  accounts,
  address,
  setAddress,
  allowInvalidAddress = false,
}) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [inputAddress, setInputAddress] = useState(address);
  const ref = useRef();

  const selectedAccount = accounts.find(
    (item) => normalizeAddress(item.address) === address,
  );
  const shortAddr = addressEllipsis(address);
  const { identity } = useChainSettings();
  const [identities, setIdentities] = useState({});

  const fetchAddressIdentity = useCallback(
    (address) => {
      const identityAddress = encodeAddressToChain(address, identity);
      fetchIdentity(identity, identityAddress).then((identity) => {
        if (!identity || identity?.info?.status === "NO_ID") {
          return;
        }
        setIdentities((identities) => ({
          ...identities,
          [address]: {
            identity,
            displayName: getIdentityDisplay(identity),
          },
        }));
      });
    },
    [identity],
  );

  useEffect(() => {
    accounts.forEach((acc) => fetchAddressIdentity(acc.address));
  }, [fetchAddressIdentity, accounts]);

  useEffect(() => {
    fetchAddressIdentity(address);
  }, [fetchAddressIdentity, address]);

  const onBlur = () => {
    const isAddr = isAddress(inputAddress);
    if (!isAddr) {
      if (allowInvalidAddress) {
        setAddress(inputAddress);
        return;
      }

      setAddress();
      return;
    }

    const ss58Addr = normalizeAddress(inputAddress);
    if (!ss58Addr) {
      if (allowInvalidAddress) {
        setAddress(inputAddress);
        return;
      }

      setAddress();
      return;
    }

    setAddress(ss58Addr);
    setInputAddress(ss58Addr);
    setEdit(false);
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
          <IdentityName>
            {identities[selectedAccount.address] && (
              <IdentityIcon
                identity={identities[selectedAccount.address]?.identity}
              />
            )}
            <div>
              {identities[selectedAccount.address]?.displayName ||
                selectedAccount.name}
            </div>
          </IdentityName>
          <div>{shortAddr}</div>
        </NameWrapper>
      </>
    );
  } else {
    selectContent = (
      <>
        <Avatar address={address} />
        <NameWrapper>
          <IdentityName>
            {identities[address] && (
              <IdentityIcon identity={identities[address].identity} />
            )}
            <div>{identities[address]?.displayName || shortAddr}</div>
          </IdentityName>
          <div>{shortAddr}</div>
        </NameWrapper>
      </>
    );
  }

  const listOptions = (
    <Options className="scrollbar-pretty">
      {(accounts || []).map((item, index) => {
        const ss58Address = normalizeAddress(item.address);
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
              <IdentityName>
                {identities[item.address] && (
                  <IdentityIcon identity={identities[item.address].identity} />
                )}
                <div>{identities[item.address]?.displayName || item.name}</div>
              </IdentityName>
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
