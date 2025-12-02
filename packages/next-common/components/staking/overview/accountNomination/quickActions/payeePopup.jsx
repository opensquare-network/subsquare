import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Signer from "next-common/components/popup/fields/signerField";
import { useContextApi } from "next-common/context/api";
import { useState, useEffect } from "react";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import CommonSelectField from "next-common/components/popup/fields/commonSelectField";
import AddressCombo from "next-common/components/addressCombo";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const payoutDestinationOptions = [
  { label: "Compound", value: "compound" },
  { label: "To your account", value: "this_account" },
  { label: "To another account", value: "another_account" },
  { label: "None", value: "none" },
];

function parsePayeeData(payeeData, currentAddress) {
  if ("none" in payeeData) {
    return { destination: "none" };
  }

  if ("staked" in payeeData) {
    return { destination: "compound" };
  }

  if ("stash" in payeeData) {
    return { destination: "this_account" };
  }

  if ("account" in payeeData) {
    const accountAddress = payeeData.account;
    const isCurrentAccount = accountAddress === currentAddress;

    return {
      destination: isCurrentAccount ? "this_account" : "another_account",
      customAddress: isCurrentAccount ? null : accountAddress,
    };
  }

  return { destination: "compound" };
}

function useCurrentPayee(address) {
  const api = useContextApi();
  const [payeeInfo, setPayeeInfo] = useState({
    destination: "compound",
    customAddress: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!api || !api.query.staking || !address) {
      return;
    }

    api.query.staking
      .payee(address)
      .then((payee) => {
        const payeeData = payee.toJSON();
        const { destination, customAddress = null } = parsePayeeData(
          payeeData,
          address,
        );

        setPayeeInfo({
          destination,
          customAddress,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch payee:", error);
        setPayeeInfo((prev) => ({ ...prev, isLoading: false }));
      });
  }, [api, address]);

  return payeeInfo;
}

function PayeePopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();

  const { destination, customAddress, isLoading } =
    useCurrentPayee(realAddress);

  const [payoutDestination, setPayoutDestination] = useState(destination);
  const [customPayoutAddress, setCustomPayoutAddress] = useState(customAddress);

  useEffect(() => {
    if (!isLoading) {
      setPayoutDestination(destination);
      setCustomPayoutAddress(customAddress);
    }
  }, [destination, customAddress, isLoading]);

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api || !api.tx.staking) {
        return;
      }

      if (payoutDestination === "another_account" && !customPayoutAddress) {
        toastError("Please enter payout address.");
        return;
      }

      let payee;
      if (payoutDestination === "none") {
        payee = "None";
      } else if (payoutDestination === "compound") {
        payee = { Staked: null };
      } else if (payoutDestination === "this_account") {
        payee = { Account: realAddress };
      } else if (payoutDestination === "another_account") {
        payee = { Account: customPayoutAddress };
      } else {
        toastError("Invalid payout destination.");
        return;
      }

      return api.tx.staking.setPayee(payee);
    },
    [api, payoutDestination, customPayoutAddress, realAddress],
  );

  return (
    <div className="space-y-4">
      <Signer noSwitchSigner />
      <CommonSelectField
        title="Payout Destination"
        options={payoutDestinationOptions}
        value={payoutDestination}
        setValue={setPayoutDestination}
      />
      {payoutDestination === "another_account" && (
        <AddressCombo
          key={payoutDestination}
          accounts={extensionAccounts}
          address={customPayoutAddress}
          setAddress={setCustomPayoutAddress}
        />
      )}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-between">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <TxSubmissionButton
          getTxFunc={getTxFuncForSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

export default function PayeePopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Update Payout Destination" onClose={onClose}>
        <PayeePopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
