import { useRef, useState } from "react";
import styled, { css } from "styled-components";
import Avatar from "./avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import { isAddress, isEthereumAddress } from "@polkadot/util-crypto";
import Caret from "./icons/caret";
import { addressEllipsis, cn, isSameAddress } from "../utils";
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
  width: 100%;
  overflow: hidden;
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
    if (!isSameAddress(maybeEvmAddress, address)) {
      addressHint += ` (${addressEllipsis(address)})`;
    }
  }

  return addressHint;
}

export function AddressComboInput({
  inputAddress,
  setInputAddress,
  onBlur,
  placeholder,
  avatarSize = 40,
}) {
  return (
    <>
      <Avatar address={inputAddress} size={avatarSize} />
      <Input
        value={inputAddress}
        onChange={(e) => setInputAddress(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    </>
  );
}

export function IdentityDisplay({ address, name }) {
  const { identity, hasIdentity } = useIdentityInfo(address);
  const displayName = getIdentityDisplay(identity);
  const addressHint = getAddressHint(address);

  return (
    <IdentityName>
      {hasIdentity ? (
        <>
          <IdentityIcon identity={identity} />
          <div className="line-clamp-1">{displayName || name}</div>
        </>
      ) : (
        <div className="line-clamp-1 text-textPrimary">
          {displayName || name || addressHint}
        </div>
      )}
    </IdentityName>
  );
}

export function AddressComboListItemAccount({ account, size }) {
  const { isLoading } = useIdentityInfo(account.address);
  const address = normalizeAddress(account.address);

  if (isLoading) {
    return <AddressInfoLoading address={address} size={size} />;
  }

  return (
    <>
      <Avatar address={account.address} size={size === "default" ? 40 : 24} />
      <NameWrapper>
        <IdentityDisplay address={account.address} name={account?.name} />
        {size === "default" && (
          <div className="flex-1 w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
            {address}
          </div>
        )}
      </NameWrapper>
    </>
  );
}

function AvatarNameWrapper({ address, children, avatarSize = 40 }) {
  return (
    <>
      <Avatar address={address} size={avatarSize} />
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

export function AddressComboCustomAddress({ address, size = "default" }) {
  const { identity, isLoading, hasIdentity } = useIdentityInfo(address);

  if (isLoading) {
    return <AddressInfoLoading address={address} size={size} />;
  }

  if (size !== "default") {
    return <AddressComboListItemAccount account={{ address }} size={size} />;
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
  size = "default",
}) {
  const selectedAccount = accounts.find((item) =>
    isSameAddress(normalizeAddress(item.address), address),
  );

  if (edit) {
    return (
      <AddressComboInput
        inputAddress={inputAddress}
        setInputAddress={setInputAddress}
        onBlur={onBlur}
        placeholder={placeholder}
        avatarSize={size === "default" ? 40 : 24}
      />
    );
  }

  if (selectedAccount) {
    return (
      <AddressComboListItemAccount account={selectedAccount} size={size} />
    );
  }

  if (size !== "default") {
    return <AddressComboListItemAccount account={{ address }} size={size} />;
  }

  return <AddressComboCustomAddress address={address} size={size} />;
}

function AddressComboListOptions({ accounts, address, onSelect, size }) {
  return (
    <Options className="scrollbar-pretty">
      {(accounts || []).map((item, index) => {
        return (
          <Item
            key={index}
            onClick={() => onSelect(item)}
            selected={isSameAddress(item.address, address)}
            className={cn(size === "small" && "!h-10")}
          >
            <AddressComboListItemAccount account={item} size={size} />
          </Item>
        );
      })}
    </Options>
  );
}

export default function AddressCombo({
  className,
  accounts,
  address,
  setAddress,
  allowInvalidAddress = false,
  readOnly = false,
  canEdit = true,
  size = "default",
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
        className={cn(
          className,
          readOnly && "pointer-events-none",
          size === "small" && "!h-10",
        )}
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
          edit={edit && canEdit}
          size={size}
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
          size={size}
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
