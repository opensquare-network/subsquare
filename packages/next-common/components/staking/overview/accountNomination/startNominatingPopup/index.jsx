import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useContextApi } from "next-common/context/api";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Signer from "next-common/components/popup/fields/signerField";
import CommonSelectField from "next-common/components/popup/fields/commonSelectField";
import { useState } from "react";
import AddressCombo from "next-common/components/addressCombo";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { cn } from "next-common/utils";
import { NominationField } from "./nominationField";
import { BondField } from "./bondField";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

const payoutDestinationOptions = [
  { label: "Compound", value: "compound" },
  { label: "To your account", value: "this_account" },
  { label: "To another account", value: "another_account" },
];

function PayoutDestinationSelect({ value, setValue }) {
  return (
    <CommonSelectField
      title="Payout Destination"
      options={payoutDestinationOptions}
      value={value}
      setValue={setValue}
    />
  );
}

function StartNominatingPopupContent() {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();
  const [payoutDestination, setPayoutDestination] = useState("compound");
  const [customPayoutAddress, setCustomPayoutAddress] = useState("");
  const [nominations, setNominations] = useState([]);
  const [bondAmount, setBondAmount] = useState("");

  const isCustomPayout = !["compound", "this_account"].includes(
    payoutDestination,
  );
  let payoutAddress = isCustomPayout ? customPayoutAddress : realAddress;

  const { transferrable, isLoading: isLoadingTransferrable } =
    useAccountTransferrable(api, realAddress);

  return (
    <div className="space-y-4">
      <Signer
        title="Origin"
        balance={transferrable}
        isBalanceLoading={isLoadingTransferrable}
        noSwitchSigner
        showTransferable
      />
      <div className="space-y-2">
        <PayoutDestinationSelect
          value={payoutDestination}
          setValue={setPayoutDestination}
        />
        <AddressCombo
          key={payoutDestination}
          className={cn(!isCustomPayout && "!bg-neutral200 !border-0")}
          accounts={extensionAccounts}
          address={payoutAddress}
          setAddress={setCustomPayoutAddress}
          readOnly={!isCustomPayout}
          placeholder="Enter payout address"
        />
      </div>
      <NominationField
        nominations={nominations}
        setNominations={setNominations}
      />
      <BondField bondAmount={bondAmount} setBondAmount={setBondAmount} />
      <div className="flex justify-end">
        <TxSubmissionButton getTxFunc={() => {}} />
      </div>
    </div>
  );
}

export default function StartNominatingPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Start Nominating" onClose={onClose}>
        <StartNominatingPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
