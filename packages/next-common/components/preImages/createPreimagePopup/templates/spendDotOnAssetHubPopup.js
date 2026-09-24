import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "../notePreimageButton";
import {
  getBeneficiaryParam,
  getNativeAssetKindParam,
} from "./batchTreasurySpendPopup";
import useAssetHubDotBalanceField from "../fields/useAssetHubDotBalanceField";
import useAddressComboField from "../fields/useAddressComboField";
import useValidFromField from "../fields/useValidFromField";
import { useChainSettings } from "next-common/context/chain";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";
import ExtrinsicInfo from "../../newPreimagePopup/info";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

export function useSpendDotOnAssetHubPreimageTx(
  inputBalance,
  beneficiary,
  validFrom,
) {
  const { decimals } = useChainSettings();
  const api = useContextApi();

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
      const proposal = api.tx.treasury.spend(
        getNativeAssetKindParam(),
        bnValue.toFixed(),
        getBeneficiaryParam(beneficiary),
        validFrom ? parseInt(validFrom) : null,
      );

      return getState(api, proposal);
    } catch (e) {
      console.error(e);
      return {};
    }
  }, [api, inputBalance, beneficiary, validFrom, decimals]);
}

function PopupContent() {
  const { value: inputBalance, component: balanceField } =
    useAssetHubDotBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();

  const { notePreimageTx, encodedLength, encodedProposal, encodedHash } =
    useSpendDotOnAssetHubPreimageTx(inputBalance, beneficiary, validFrom);

  return (
    <>
      <SignerWithBalance />
      {balanceField}
      <div className="flex flex-col gap-[8px]">{beneficiaryField}</div>
      {validFromField}
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
    </>
  );
}

export default function SpendDotOnAssetHubPopup() {
  const { onClose } = usePopupParams();
  const { symbol } = useChainSettings();
  return (
    <Popup title={`${symbol} treasury proposal`} onClose={onClose}>
      <PopupContent />
    </Popup>
  );
}
