import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isAddress, isEthereumAddress } from "@polkadot/util-crypto";
import Caret from "../icons/caret";
import { normalizeAddress } from "next-common/utils/address.js";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useClickAway } from "react-use";
import useSearchFellowshipMember from "./useSearchFellowshipMember";
import SelectOptions from "./options";
import SelectHeader from "./header";
import useHighlightedOption from "./useHighlightedOption";

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

  const onSelect = useCallback(
    (item) => {
      if (!item) {
        return;
      }

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
  const { highlightedIndex, handleKeyDown } = useHighlightedOption(
    searchedResult,
    onSelect,
  );

  useEffect(() => {
    if (!show) {
      return;
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, handleKeyDown]);

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
