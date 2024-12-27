import { useRef, useState } from "react";
import styled, { css } from "styled-components";
import Avatar from "./avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import { isAddress, isEthereumAddress } from "@polkadot/util-crypto";
import Caret from "./icons/caret";
import { addressEllipsis, cn } from "../utils";
import { normalizeAddress } from "next-common/utils/address.js";
import { getIdentityDisplay } from "next-common/utils/identity.js";
import IdentityIcon from "./Identity/identityIcon.js";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useClickAway } from "react-use";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import AddressInfoLoading from "./addressInfo";

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

function AddressComboInput({
  inputAddress,
  setInputAddress,
  onBlur,
  placeholder,
}) {
  return (
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
}

function AddressComboListItemAccount({ account }) {
  const { identity, hasIdentity } = useIdentityInfo(account.address);
  const displayName = getIdentityDisplay(identity);
  const address = normalizeAddress(account.address);
  const addressHint = getAddressHint(address);

  return (
    <>
      <Avatar address={account.address} size={40} />
      <NameWrapper>
        <IdentityName>
          {hasIdentity && <IdentityIcon identity={identity} />}
          <div className="line-clamp-1">{displayName || account.name}</div>
        </IdentityName>
        <div>{addressHint}</div>
      </NameWrapper>
    </>
  );
}

function AvatarNameWrapper({ address, children }) {
  return (
    <>
      <Avatar address={address} size={40} />
      <NameWrapper className="truncate">{children}</NameWrapper>
    </>
  );
}

function Identity({ identity, address }) {
  const addressHint = getAddressHint(address);
  const displayName = getIdentityDisplay(identity);
  return (
    <AvatarNameWrapper address={address}>
      <IdentityName className="truncate">
        <IdentityIcon identity={identity} />
        <div className="whitespace-nowrap truncate">{displayName}</div>
      </IdentityName>
      <div>{addressHint}</div>
    </AvatarNameWrapper>
  );
}

function NoIdentity({ address }) {
  const maybeEvmAddress = tryConvertToEvmAddress(address);
  return (
    <AvatarNameWrapper address={address}>
      <IdentityName className="truncate">
        <div className="whitespace-nowrap truncate">{maybeEvmAddress}</div>
      </IdentityName>
    </AvatarNameWrapper>
  );
}

function AddressComboCustomAddress({ address }) {
  const { identity, isLoading, hasIdentity } = useIdentityInfo(address);

  if (isLoading) {
    return <AddressInfoLoading address={address} />;
  }

  if (hasIdentity) {
    return <Identity identity={identity} address={address} />;
  }

  return <NoIdentity address={address} />;
}

function AddressComboHeader({
  inputAddress,
  setInputAddress,
  onBlur,
  placeholder,
  accounts,
  address,
  edit,
}) {
  const selectedAccount = accounts.find(
    (item) => normalizeAddress(item.address) === address,
  );

  if (edit) {
    return (
      <AddressComboInput
        inputAddress={inputAddress}
        setInputAddress={setInputAddress}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    );
  }

  if (selectedAccount) {
    return <AddressComboListItemAccount account={selectedAccount} />;
  }

  return <AddressComboCustomAddress address={address} />;
}

function AddressComboListOptions({ accounts, address, onSelect }) {
  return (
    <Options className="scrollbar-pretty">
      {(accounts || []).map((item, index) => {
        return (
          <Item
            key={index}
            onClick={() => onSelect(item)}
            selected={item.address === address}
          >
            <AddressComboListItemAccount account={item} />
          </Item>
        );
      })}
    </Options>
  );
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
  useClickAway(ref, () => setShow(false));

  const isValidAddress =
    isAddress(address) ||
    normalizeAddress(address) ||
    isEthereumAddress(address);
  const [edit, setEdit] = useState(!isValidAddress);

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

  const onSelect = (item) => {
    const ss58Address = normalizeAddress(item.address);
    const maybeEvmAddress = tryConvertToEvmAddress(ss58Address);
    setAddress(ss58Address);
    setInputAddress(maybeEvmAddress);
    setEdit(false);
    setShow(false);
  };

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
        <AddressComboHeader
          inputAddress={inputAddress}
          setInputAddress={setInputAddress}
          onBlur={onBlur}
          placeholder={placeholder}
          accounts={accounts}
          address={address}
          edit={edit}
        />
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
      {show && (accounts || []).length > 0 && (
        <AddressComboListOptions
          accounts={accounts}
          address={address}
          onSelect={onSelect}
        />
      )}

      {address && !isValidAddress && !allowInvalidAddress && (
        <div className="mt-2 text-red500 text12Medium">
          Please fill a valid address
        </div>
      )}
    </Wrapper>
  );
}
