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
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";
import ExtrinsicInfo from "../../newPreimagePopup/info";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

// The legacy flow, used while `modules.treasury.approvals` is true for a chain
// (see next-common/utils/treasury/approvals.js).
// `spend_local` writes the proposal into `Proposals`/`Approvals`, so it is
// awarded automatically at the end of a spend period.
export function useSpendLocalTreasuryPreimageTx(inputBalance, beneficiary) {
  const api = useContextApi();
  const { decimals } = useChainSettings();

  return useMemo(() => {
    if (!api || !inputBalance || !beneficiary) {
      return {};
    }

    let bnValue;
    try {
      bnValue = checkInputValue(inputBalance, decimals);
    } catch {
      return {};
    }

    try {
      const proposal = api.tx.treasury.spendLocal(
        bnValue.toFixed(),
        beneficiary,
      );
      return getState(api, proposal);
    } catch (e) {
      console.error("Failed to build treasury spend_local preimage:", e);
      return {};
    }
  }, [api, inputBalance, beneficiary, decimals]);
}

export default function SpendLocalTreasuryProposalPopup() {
  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();

  const { notePreimageTx, encodedLength, encodedProposal, encodedHash } =
    useSpendLocalTreasuryPreimageTx(inputBalance, beneficiary);

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose}>
      <SignerWithBalance />
      {balanceField}
      {beneficiaryField}
      {encodedProposal && (
        <ExtrinsicInfo
          preimageHash={encodedHash}
          callData={encodedProposal}
          preimageLength={encodedLength || 0}
        />
      )}
      <InsufficientBalanceTips byteLength={encodedLength} preimageOnly />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={() => notePreimageTx} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </Popup>
  );
}
