import { useEffect, useMemo, useRef, useState } from "react";
import { isAddress, isEthereumAddress } from "@polkadot/util-crypto";
import Caret from "../icons/caret";
import { cn } from "next-common/utils";
import { normalizeAddress } from "next-common/utils/address.js";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useClickAway } from "react-use";
import FellowshipRank from "../fellowship/rank";
import {
  AddressComboListItemAccount,
  AddressComboCustomAddress,
  AddressComboInput,
} from "next-common/components/addressCombo";

function SelectHeader({
  inputAddress,
  setInputAddress,
  onBlur,
  placeholder,
  members,
  address,
  edit,
}) {
  const selectedAccount = useMemo(
    () => members.find((item) => normalizeAddress(item.address) === address),
    [members, address],
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
    return (
      <>
        <AddressComboListItemAccount account={selectedAccount} />
        <div className="w-5 h-5 flex">
          <FellowshipRank rank={selectedAccount.rank} />
        </div>
      </>
    );
  }

  return <AddressComboCustomAddress address={address} />;
}

function SelectOptions({ members, address, onSelect }) {
  return (
    <div className="absolute w-full mt-1 bg-neutral100 shadow-200 border border-neutral300 rounded-md max-h-80 overflow-y-auto z-10 py-2">
      {members.map((item) => (
        <div
          key={item.address}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-neutral200",
            item.address === address && "bg-neutral200",
          )}
          onClick={() => onSelect(item)}
        >
          <AddressComboListItemAccount account={item} />
          <div className="w-5 h-5 flex">
            <FellowshipRank rank={item.rank} />
          </div>
        </div>
      ))}
    </div>
  );
}

function isFellowshipMemberAddress(members = [], address) {
  return members?.some((item) => item.address === address);
}

export default function FellowshipMemberSelector({
  address,
  setAddress,
  setIsAvailableMember,
  members,
  placeholder = "Please fill the address or select another one...",
}) {
  const [show, setShow] = useState(false);
  const [inputAddress, setInputAddress] = useState(
    () => tryConvertToEvmAddress(address) || "",
  );
  const ref = useRef();

  useClickAway(ref, () => setShow(false));

  const isValidAddress = useMemo(
    () =>
      isAddress(address) ||
      normalizeAddress(address) ||
      isEthereumAddress(address),
    [address],
  );

  const [edit, setEdit] = useState(!isValidAddress);

  const isFellowshipMember = useMemo(
    () => isFellowshipMemberAddress(members, address),
    [members, address],
  );

  useEffect(() => {
    setIsAvailableMember(!address || isFellowshipMember);
  }, [address, isFellowshipMember, setIsAvailableMember]);

  const onBlur = () => {
    const isAddr = isAddress(inputAddress);
    const ss58Addr = normalizeAddress(inputAddress);

    if (!isAddr || !ss58Addr) {
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
    <div ref={ref} className="relative">
      <div
        className="flex items-center bg-neutral100 border border-neutral400 rounded-md space-x-3 h-14 px-4 cursor-pointer"
        onClick={() => {
          setShow(true);
          setEdit(true);
          setTimeout(() => ref.current.querySelector("input")?.focus(), 100);
        }}
      >
        <SelectHeader
          inputAddress={inputAddress}
          setInputAddress={setInputAddress}
          onBlur={onBlur}
          placeholder={placeholder}
          members={members}
          address={address}
          edit={edit}
        />
        {members.length > 0 && (
          <span
            onClick={(e) => {
              setShow((prevShow) => !prevShow);
              e.stopPropagation();
            }}
          >
            <Caret down={!show} />
          </span>
        )}
      </div>
      {show && members.length > 0 && (
        <SelectOptions
          members={members}
          address={address}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
