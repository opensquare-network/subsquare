import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { InfoMessage } from "next-common/components/setting/styled";
import NotePreimageButton from "../notePreimageButton";
import useBalanceField from "../fields/useBalanceField";
import useValidFromField from "../fields/useValidFromField";
import useAddressComboField from "../fields/useAddressComboField";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import Popup from "next-common/components/popup/wrapper/Popup";

export function useTreasurySpendNotePreimageTx(
  inputBalance,
  beneficiary,
  validFrom,
) {
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
      const spend = api.tx.treasury.spend;
      const proposal = spend(
        // Hydration Use assets temporarily and use default native assets
        null,
        bnValue.toFixed(),
        beneficiary,
        validFrom ? parseInt(validFrom) : null,
      );
      return getState(api, proposal);
    } catch (e) {
      return {};
    }
  }, [api, inputBalance, beneficiary, decimals, validFrom]);
}

function PopupContent() {
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();

  const { notePreimageTx } = useTreasurySpendNotePreimageTx(
    inputBalance,
    beneficiary,
    validFrom,
  );

  return (
    <>
      <SignerWithBalance />
      {balanceField}
      <div className="flex flex-col gap-[8px]">
        {beneficiaryField}
        <InfoMessage>
          Please input an AssetHub address as the beneficiary
        </InfoMessage>
      </div>
      {validFromField}
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </>
  );
}

export default function NewTreasurySpendProposalPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Create Treasury Spend Proposal" onClose={onClose}>
      <PopupContent />
    </Popup>
  );
}
