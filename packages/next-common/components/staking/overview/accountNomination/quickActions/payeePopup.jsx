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
import {
  PAYOUT_DESTINATION,
  PAYOUT_DESTINATION_OPTIONS,
  parsePayeeData,
  buildPayeeParam,
} from "next-common/components/staking/overview/accountNomination/quickActions/payoutDestination";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

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
  const dispatch = useDispatch();
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

  const getDestinationLabel = () => {
    switch (payoutDestination) {
      case PAYOUT_DESTINATION.COMPOUND:
        return "Compound";
      case PAYOUT_DESTINATION.THIS_ACCOUNT:
        return "To your account";
      case PAYOUT_DESTINATION.ANOTHER_ACCOUNT:
        return "To another account";
      case PAYOUT_DESTINATION.NONE:
        return "None";
      default:
        return "";
    }
  };

  const handleInBlock = () => {
    dispatch(
      newSuccessToast(
        `Payout destination updated successfully to "${getDestinationLabel()}".`,
      ),
    );
  };

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
          onInBlock={handleInBlock}
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
