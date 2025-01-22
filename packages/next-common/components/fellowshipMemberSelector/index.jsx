import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import useSearchFellowshipMember from "./useSearchFellowshipMember";

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

function SelectOptions({ members, address, onSelect, highlightedIndex }) {
  return (
    <div className="absolute w-full mt-1 bg-neutral100 shadow-200 border border-neutral300 rounded-md max-h-80 overflow-y-auto z-10 py-2">
      {members.map((item, index) => (
        <div
          key={item.address}
          className={cn(
            `option-item-${index}`,
            "w-full flex items-center gap-4 px-4 py-2 cursor-pointer",
            item.address === address && "bg-neutral200",
            index === highlightedIndex && "bg-neutral300",
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
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

  const onSelect = useCallback(
    (item) => {
      const ss58Address = normalizeAddress(item.address);
      const maybeEvmAddress = tryConvertToEvmAddress(ss58Address);
      setAddress(ss58Address);
      setInputAddress(maybeEvmAddress);
      setEdit(false);
      setShow(false);
    },
    [setAddress, setInputAddress, setEdit, setShow],
  );

  const searchedResult = useSearchFellowshipMember(inputAddress, members);

  useEffect(() => {
    if (!show || highlightedIndex < 0) return;

    const optionElement = document.querySelector(
      `.option-item-${highlightedIndex}`,
    );
    if (optionElement) {
      optionElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex, show]);

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) =>
          prevIndex < searchedResult.length - 1 ? prevIndex + 1 : prevIndex,
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        onSelect(searchedResult[highlightedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, highlightedIndex, searchedResult, onSelect]);

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
          members={searchedResult}
          address={address}
          edit={edit}
        />
        {searchedResult.length > 0 && (
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
      {show && searchedResult.length > 0 && (
        <SelectOptions
          members={searchedResult}
          address={address}
          onSelect={onSelect}
          highlightedIndex={highlightedIndex}
        />
      )}
    </div>
  );
}
