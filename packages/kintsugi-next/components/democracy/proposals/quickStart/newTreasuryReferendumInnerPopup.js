import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import PopupLabel from "next-common/components/popup/label";
import Input from "next-common/components/input";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";

function SubmissionDeposit() {
  const api = useContextApi();
  const { symbol, decimals } = useChainSettings();
  const deposit = new BigNumber(api?.consts?.democracy?.minimumDeposit || 0)
    .div(Math.pow(10, decimals))
    .toNumber();

  return (
    <div>
      <PopupLabel text="Submission Deposit" />
      <Input disabled value={deposit} placeholder="0" symbol={symbol} />
    </div>
  );
}

export function NewTreasuryReferendumInnerPopup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const api = useContextApi();
  const { onClose } = usePopupParams();
  const { decimals } = useChainSettings();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    if (!beneficiary) {
      dispatch(newErrorToast("Beneficiary address is required"));
      return;
    }

    if (!inputBalance) {
      dispatch(newErrorToast("Request balance is required"));
      return;
    }

    let value = null;
    try {
      value = checkInputValue(inputBalance, decimals, "Request balance", false);
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    const spendTx = api.tx.democracy.spendFromTreasury(
      value.toString(),
      beneficiary,
    );
    return api.tx.democracy.propose(
      {
        Inline: spendTx.method.toHex(),
      },
      api?.consts?.democracy?.minimumDeposit,
    );
  }, [dispatch, api, decimals, inputBalance, beneficiary]);

  return (
    <Popup
      title="Create Treasury Proposal"
      className="!w-[640px]"
      onClose={onClose}
      wide
    >
      <SignerWithBalance />
      {balanceField}
      {beneficiaryField}
      <AdvanceSettings>
        <SubmissionDeposit />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton
          onInBlock={({ events }) => {
            const eventData = getEventData(events, "democracy", "Proposed");
            if (!eventData) {
              return;
            }
            const [proposalIndex] = eventData;
            router.push(`/democracy/proposals/${proposalIndex}`);
          }}
          getTxFunc={getTxFunc}
        />
      </div>
    </Popup>
  );
}
