import { useCallback } from "react";
import { useDispatch } from "react-redux";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import SecondaryButton from "next-common/lib/button/secondary";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress, toPrecision } from "next-common/utils";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useVestPopup } from "../context/vestPopupContext";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import PopupWithSigner from "next-common/components/popupWithSigner";

export function VestPopupContent() {
  const { account, unlockable } = useVestPopup();
  const { onClose } = usePopupParams();
  const dispatch = useDispatch();
  const api = useContextApi();
  const { symbol, decimals } = useChainSettings();
  const realAddress = useRealAddress();

  const getTxFunc = useCallback(() => {
    if (!api || !api.tx.vesting) {
      return;
    }

    return isSameAddress(account, realAddress)
      ? api.tx.vesting.vest()
      : api.tx.vesting.vestOther(account);
  }, [api, account, realAddress]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Vest successfully"));
    onClose();
  }, [dispatch, onClose]);

  return (
    <div className="space-y-4">
      <SignerWithBalance noSwitchSigner />
      <SummaryLayout>
        <SummaryItem title="Account">
          <AddressUser add={account} />
        </SummaryItem>
        <SummaryItem title="Estimated Unlockable">
          <ValueDisplay
            value={toPrecision(unlockable, decimals)}
            symbol={symbol}
          />
        </SummaryItem>
      </SummaryLayout>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end gap-x-4">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <TxSubmissionButton getTxFunc={getTxFunc} onInBlock={onInBlock} />
      </div>
    </div>
  );
}

export default function VestPopup({ onClose, update }) {
  return (
    <PopupWithSigner onClose={onClose} title="Vest">
      <VestPopupContent update={update} />
    </PopupWithSigner>
  );
}
