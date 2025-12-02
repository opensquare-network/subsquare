import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Signer from "next-common/components/popup/fields/signerField";
import { useContextApi } from "next-common/context/api";
import { useState, useEffect, useMemo } from "react";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import CommonSelectField from "next-common/components/popup/fields/commonSelectField";
import AddressCombo from "next-common/components/addressCombo";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const PAYOUT_DESTINATION = {
  COMPOUND: "compound",
  THIS_ACCOUNT: "this_account",
  ANOTHER_ACCOUNT: "another_account",
  NONE: "none",
};

const PAYEE_TYPE = {
  NONE: "none",
  STAKED: "staked",
  STASH: "stash",
  ACCOUNT: "account",
};

function createPayoutOptionLabel(title, description) {
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="text14Medium text-textPrimary whitespace-nowrap">
        {title}
      </div>
      <div className="text12Medium text-textTertiary whitespace-nowrap">
        {description}
      </div>
    </div>
  );
}

const PAYOUT_DESTINATION_OPTIONS = [
  {
    label: createPayoutOptionLabel(
      "Compound",
      "Add payouts to your existing staked balance automatically.",
    ),
    value: PAYOUT_DESTINATION.COMPOUND,
  },
  {
    label: createPayoutOptionLabel(
      "To your account",
      "Payouts are sent to your account as free balance.",
    ),
    value: PAYOUT_DESTINATION.THIS_ACCOUNT,
  },
  {
    label: createPayoutOptionLabel(
      "To another account",
      "Send payouts to another account as free balance.",
    ),
    value: PAYOUT_DESTINATION.ANOTHER_ACCOUNT,
  },
  {
    label: createPayoutOptionLabel("None", "Have no payout destination set."),
    value: PAYOUT_DESTINATION.NONE,
  },
];

function parsePayeeData(payeeData, currentAddress) {
  if (PAYEE_TYPE.NONE in payeeData) {
    return { destination: PAYOUT_DESTINATION.NONE };
  }

  if (PAYEE_TYPE.STAKED in payeeData) {
    return { destination: PAYOUT_DESTINATION.COMPOUND };
  }

  if (PAYEE_TYPE.STASH in payeeData) {
    return { destination: PAYOUT_DESTINATION.THIS_ACCOUNT };
  }

  if (PAYEE_TYPE.ACCOUNT in payeeData) {
    const accountAddress = payeeData.account;
    const isCurrentAccount = accountAddress === currentAddress;

    return {
      destination: isCurrentAccount
        ? PAYOUT_DESTINATION.THIS_ACCOUNT
        : PAYOUT_DESTINATION.ANOTHER_ACCOUNT,
      customAddress: isCurrentAccount ? null : accountAddress,
    };
  }

  return { destination: PAYOUT_DESTINATION.COMPOUND };
}

function buildPayeeParam(destination, realAddress, customAddress) {
  const payeeMap = {
    [PAYOUT_DESTINATION.NONE]: "None",
    [PAYOUT_DESTINATION.COMPOUND]: { Staked: null },
    [PAYOUT_DESTINATION.THIS_ACCOUNT]: { Account: realAddress },
    [PAYOUT_DESTINATION.ANOTHER_ACCOUNT]: { Account: customAddress },
  };

  return payeeMap[destination];
}

function useCurrentPayee(address) {
  const api = useContextApi();
  const [payeeInfo, setPayeeInfo] = useState({
    destination: PAYOUT_DESTINATION.COMPOUND,
    customAddress: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!api?.query?.staking || !address) {
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

  const isUnchanged = useMemo(() => {
    if (isLoading) {
      return true;
    }

    if (payoutDestination !== destination) {
      return false;
    }

    if (payoutDestination === PAYOUT_DESTINATION.ANOTHER_ACCOUNT) {
      return customPayoutAddress === customAddress;
    }

    return true;
  }, [
    isLoading,
    payoutDestination,
    destination,
    customPayoutAddress,
    customAddress,
  ]);

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api?.tx?.staking) {
        return;
      }

      if (
        payoutDestination === PAYOUT_DESTINATION.ANOTHER_ACCOUNT &&
        !customPayoutAddress
      ) {
        toastError("Please enter payout address.");
        return;
      }

      const payee = buildPayeeParam(
        payoutDestination,
        realAddress,
        customPayoutAddress,
      );

      if (!payee) {
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
        title="Destination"
        options={PAYOUT_DESTINATION_OPTIONS}
        value={payoutDestination}
        setValue={setPayoutDestination}
        itemHeight={56}
      />
      {payoutDestination === PAYOUT_DESTINATION.ANOTHER_ACCOUNT && (
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
          disabled={isLoading || isUnchanged}
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
