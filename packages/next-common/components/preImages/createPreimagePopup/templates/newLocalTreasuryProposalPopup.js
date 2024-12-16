import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "../notePreimageButton";
import useBalanceField from "../fields/useBalanceField";
import useAddressComboField from "../fields/useAddressComboField";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

export function useLocalTreasuryNotePreimageTx(inputBalance, beneficiary) {
  const api = useContextApi();
  const { decimals } = useChainSettings();

  return useMemo(() => {
    if (!api || !inputBalance || !beneficiary) {
      return {};
    }

    let bnValue;
    try {
      bnValue = checkInputValue(inputBalance, decimals);
    } catch (err) {
      return {};
    }

    try {
      const spend = api.tx.treasury.spendLocal || api.tx.treasury.spend;
      const proposal = spend(bnValue.toFixed(), beneficiary);
      return getState(api, proposal);
    } catch (e) {
      return {};
    }
  }, [api, inputBalance, beneficiary, decimals]);
}

export default function NewLocalTreasuryProposalPopup() {
  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();

  const { notePreimageTx } = useLocalTreasuryNotePreimageTx(
    inputBalance,
    beneficiary,
  );

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose}>
      <SignerWithBalance />
      {balanceField}
      {beneficiaryField}
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </Popup>
  );
}
