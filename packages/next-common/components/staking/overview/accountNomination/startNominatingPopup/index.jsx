import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Signer from "next-common/components/popup/fields/signerField";
import CommonSelectField from "next-common/components/popup/fields/commonSelectField";
import { useCallback, useState } from "react";
import AddressCombo from "next-common/components/addressCombo";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { cn, toPrecisionNumber } from "next-common/utils";
import { NominationField } from "./nominationField";
import { BondField } from "./bondField";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import BigNumber from "bignumber.js";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useChainSettings } from "next-common/context/chain";
import ErrorMessage from "next-common/components/styled/errorMessage";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

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
  const [nominees, setNominees] = useState([]);
  const [bondAmount, setBondAmount] = useState("");
  const { decimals } = useChainSettings();
  const { result: minNominatorBond, loading: isLoadingMinNominatorBond } =
    useSubStorage("staking", "minNominatorBond", []);
  const minBond = toPrecisionNumber(minNominatorBond, decimals);

  const lessThanMinBond =
    !isLoadingMinNominatorBond && new BigNumber(bondAmount).lt(minBond);
  const atLeastOneNominee = nominees?.length < 1;
  const hasNominees = nominees && nominees.length > 0;

  const notMeetMinBond = bondAmount && lessThanMinBond;
  const notEnoughNominees = hasNominees && atLeastOneNominee;
  const canSubmit =
    bondAmount &&
    !isLoadingMinNominatorBond &&
    !lessThanMinBond &&
    hasNominees &&
    !atLeastOneNominee;

  let errorMessage = "";
  if (notEnoughNominees) {
    errorMessage = "Please select at least one nominee.";
  } else if (notMeetMinBond) {
    errorMessage = `Minimum bond amount is ${minBond} units.`;
  }

  const isCustomPayout = !["compound", "this_account"].includes(
    payoutDestination,
  );
  let payoutAddress = isCustomPayout ? customPayoutAddress : realAddress;

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    if (payoutDestination === "another_account" && !customPayoutAddress) {
      throw new Error("Please enter payout address.");
    }

    if (nominees.length < 1) {
      throw new Error("Please select at least one nominee.");
    }

    if (!bondAmount) {
      throw new Error("Please enter bond amount.");
    }

    if (new BigNumber(bondAmount).lt(minBond)) {
      throw new Error(`Minimum bond amount is ${minBond} units.`);
    }

    const bond = new BigNumber(bondAmount)
      .times(Math.pow(10, decimals))
      .toFixed(0);

    let payee;
    if (payoutDestination === "compound") {
      payee = { Staked: null };
    } else if (payoutDestination === "this_account") {
      payee = { Account: realAddress };
    } else if (payoutDestination === "another_account") {
      payee = { Account: customPayoutAddress };
    } else {
      throw new Error("Invalid payout destination.");
    }

    return api.tx.utility.batchAll([
      api.tx.staking.bond(bond, payee),
      api.tx.staking.nominate(nominees),
    ]);
  }, [
    api,
    nominees,
    bondAmount,
    customPayoutAddress,
    payoutDestination,
    realAddress,
    minBond,
    decimals,
  ]);

  return (
    <div className="space-y-4">
      <Signer title="Origin" noSwitchSigner showTransferable />
      <div className="space-y-2">
        <PayoutDestinationSelect
          value={payoutDestination}
          setValue={setPayoutDestination}
        />
        {payoutDestination !== "compound" && (
          <AddressCombo
            key={payoutDestination}
            className={cn(!isCustomPayout && "!bg-neutral200 !border-0")}
            accounts={extensionAccounts}
            address={payoutAddress}
            setAddress={setCustomPayoutAddress}
            readOnly={!isCustomPayout}
            placeholder="Enter payout address"
          />
        )}
      </div>
      <NominationField nominees={nominees} setNominees={setNominees} />
      <BondField bondAmount={bondAmount} setBondAmount={setBondAmount} />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton disabled={!canSubmit} getTxFunc={getTxFunc} />
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
