import { useMemo, useRef, useState } from "react";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { partition } from "lodash-es";
import { isAddress, isEthereumAddress } from "@polkadot/util-crypto";
import Caret from "../icons/caret";
import { cn } from "next-common/utils";
import { normalizeAddress } from "next-common/utils/address.js";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useClickAway } from "react-use";
import FellowshipRank from "../fellowship/rank";
import {
  AddressComboHeader,
  AddressComboListItemAccount,
} from "next-common/components/addressCombo";

// TODO: child components UX / UI
function AddressComboListOptions({ accounts, address, onSelect }) {
  return (
    <div className="absolute w-full mt-1 bg-neutral100 shadow-200 border border-neutral300 rounded-md max-h-80 overflow-y-auto z-10">
      {(accounts || []).map((item, index) => {
        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-neutral200",
              item.address === address && "bg-neutral200",
            )}
            onClick={() => onSelect(item)}
          >
            <AddressComboListItemAccount account={item} />
            <FellowshipRank rank={item.rank} />
          </div>
        );
      })}
    </div>
  );
}

export default function FellowshipMemberSelector({
  address,
  setAddress,
  readOnly = false,
  placeholder = "Please fill the address or select another one...",
}) {
  const { members, loading } = useFellowshipCoreMembers();

  const accounts = useMemo(() => {
    if (loading || !members) {
      return [];
    }

    return members?.filter((m) => m.rank > 0).sort((a, b) => a.rank - b.rank);
  }, [members, loading]);

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
      setAddress();
      return;
    }

    const ss58Addr = normalizeAddress(inputAddress);
    if (!ss58Addr) {
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
        className={cn(
          "flex items-center bg-neutral100 border border-neutral400 rounded-md h-14 px-4 cursor-pointer",
          readOnly && "pointer-events-none",
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
      </div>
      {show && (accounts || []).length > 0 && (
        <AddressComboListOptions
          accounts={accounts}
          address={address}
          onSelect={onSelect}
        />
      )}

      {address && !isValidAddress && (
        <div className="mt-2  tex14Medium">Please fill a valid address</div>
      )}
    </div>
  );
}
