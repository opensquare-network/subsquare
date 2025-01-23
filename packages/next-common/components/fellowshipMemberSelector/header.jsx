import { useMemo } from "react";
import { normalizeAddress } from "next-common/utils/address.js";
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

export default SelectHeader;
