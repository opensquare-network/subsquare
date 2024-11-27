import { useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Avatar from "./avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import { isAddress, isEthereumAddress } from "@polkadot/util-crypto";
import Caret from "./icons/caret";
import { addressEllipsis, cn } from "../utils";
import { normalizeAddress } from "next-common/utils/address.js";
import { fetchIdentity } from "next-common/services/identity.js";
import { useChainSettings } from "next-common/context/chain.js";
import { encodeAddressToChain } from "next-common/services/address.js";
import { getIdentityDisplay } from "next-common/utils/identity.js";
import IdentityIcon from "./Identity/identityIcon.js";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useClickAway } from "react-use";

const Wrapper = Relative;

const Select = styled(Flex)`
  background: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

const NameWrapper = styled.div`
  color: var(--textPrimary);
  flex-grow: 1;
  > :first-child {
    font-size: 14px;
    font-weight: 500;
  }
  > :nth-child(2) {
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

function getAddressHint(address) {
  let addressHint = "--";

  if (address) {
    const maybeEvmAddress = tryConvertToEvmAddress(address);

    addressHint = addressEllipsis(maybeEvmAddress);
    if (maybeEvmAddress !== address) {
      addressHint += ` (${addressEllipsis(address)})`;
    }
  }

  return addressHint;
}

export default function AddressCombo({
  accounts,
  address,
  setAddress,
  allowInvalidAddress = false,
  readOnly = false,
  placeholder = "Please fill the address or select another one...",
}) {
  const [show, setShow] = useState(false);
  const [inputAddress, setInputAddress] = useState(
    tryConvertToEvmAddress(address) || "",
  );
  const ref = useRef();

  const selectedAccount = accounts.find(
    (item) => normalizeAddress(item.address) === address,
  );
  const maybeEvmAddress = tryConvertToEvmAddress(address);
  const addressHint = getAddressHint(address);
  const { identity } = useChainSettings();
  const [identities, setIdentities] = useState({});

  const isValidAddress =
    isAddress(address) ||
    normalizeAddress(address) ||
    isEthereumAddress(address);
  const [edit, setEdit] = useState(!isValidAddress);

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
    const maybeEvmAddress = tryConvertToEvmAddress(inputAddress);
    setInputAddress(maybeEvmAddress);
    setEdit(false);
  };

  useClickAway(ref, () => {
    setShow(false);
  });

  let selectContent;

  if (edit) {
    selectContent = (
      <>
        <Avatar address={inputAddress} size={40} />
        <Input
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      </>
    );
  } else if (selectedAccount) {
    selectContent = (
      <>
        <Avatar address={selectedAccount.address} size={40} />
        <NameWrapper>
          <IdentityName>
            {identities[selectedAccount.address] && (
              <IdentityIcon
                identity={identities[selectedAccount.address]?.identity}
              />
            )}
            <div className="line-clamp-1">
              {identities[selectedAccount.address]?.displayName ||
                selectedAccount.name}
            </div>
          </IdentityName>
          <div>{addressHint}</div>
        </NameWrapper>
      </>
    );
  } else {
    selectContent = (
      <>
        <Avatar address={address} size={40} />
        <NameWrapper className="truncate">
          <IdentityName className="truncate">
            {identities[address] && (
              <IdentityIcon identity={identities[address].identity} />
            )}
            <div className="whitespace-nowrap truncate">
              {identities[address]?.displayName || maybeEvmAddress}
            </div>
          </IdentityName>
          {identities[address] && <div>{addressHint}</div>}
        </NameWrapper>
      </>
    );
  }

  const listOptions = (
    <Options className="scrollbar-pretty">
      {(accounts || []).map((item, index) => {
        const ss58Address = normalizeAddress(item.address);
        const maybeEvmAddress = tryConvertToEvmAddress(ss58Address);
        return (
          <Item
            key={index}
            onClick={() => {
              setAddress(ss58Address);
              setInputAddress(maybeEvmAddress);
              setEdit(false);
              setShow(false);
            }}
            selected={item.address === address}
          >
            <Avatar address={item.address} size={40} />
            <NameWrapper>
              <IdentityName>
                {identities[item.address] && (
                  <IdentityIcon identity={identities[item.address].identity} />
                )}
                <div className="line-clamp-1">
                  {identities[item.address]?.displayName || item.name}
                </div>
              </IdentityName>
              <div>{getAddressHint(ss58Address)}</div>
            </NameWrapper>
          </Item>
        );
      })}
    </Options>
  );

  return (
    <Wrapper ref={ref}>
      <Select
        className={cn(readOnly && "pointer-events-none")}
        onClick={() => {
          setShow(true);
          setEdit(true);
          setTimeout(() => ref.current.querySelector("input")?.focus(), 100);
        }}
      >
        {selectContent}
        {(accounts || []).length > 0 && !readOnly && (
          <span
            onClick={(e) => {
              setShow(!show);
              e.stopPropagation();
            }}
          >
            <Caret down={!show} />
          </span>
        )}
      </Select>
      {show && (accounts || []).length > 0 && listOptions}

      {address && !isValidAddress && !allowInvalidAddress && (
        <div className="mt-2 text-red500 text12Medium">
          Please fill a valid address
        </div>
      )}
    </Wrapper>
  );
}
