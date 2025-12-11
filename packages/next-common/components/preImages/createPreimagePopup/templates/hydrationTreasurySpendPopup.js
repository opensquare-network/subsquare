import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo, useState } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "../notePreimageButton";
import useAddressComboField from "../fields/useAddressComboField";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";
import ExtrinsicInfo from "../../newPreimagePopup/info";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import useHydrationCurrencyInfo from "next-common/hooks/useHydrationCurrencyInfo";
import { TreasuryProvider } from "next-common/context/treasury";

const HOLLAR_CURRENCY = {
  id: 222,
  symbol: "HOLLAR",
  decimals: 18,
};

export function useHydrationTreasurySpendPreimageTx(inputBalance, beneficiary) {
  const api = useContextApi();

  return useMemo(() => {
    if (!api || !inputBalance || !beneficiary) {
      return {};
    }

    let bnValue;
    try {
      bnValue = checkInputValue(inputBalance, HOLLAR_CURRENCY.decimals);
    } catch (err) {
      return {};
    }

    try {
      const proposal = api.tx.currencies.transfer(
        beneficiary,
        HOLLAR_CURRENCY.id,
        bnValue.toFixed(),
      );

      return getState(api, proposal);
    } catch (e) {
      console.error(e);
      return {};
    }
  }, [api, inputBalance, beneficiary]);
}

function PopupContent() {
  const [inputBalance, setInputBalance] = useState("");
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { data: currencyInfo, loading } = useHydrationCurrencyInfo(
    HOLLAR_CURRENCY.id,
  );

  const { notePreimageTx, encodedLength, encodedProposal, encodedHash } =
    useHydrationTreasurySpendPreimageTx(inputBalance, beneficiary);

  return (
    <>
      <SignerWithBalance />
      <AmountInputWithHint
        label="Request"
        hintLabel="Available"
        hintTooltip="Available treasury balance"
        maxAmount={currencyInfo?.treasuryBalance}
        decimals={HOLLAR_CURRENCY.decimals}
        symbol={HOLLAR_CURRENCY.symbol}
        isLoading={loading}
        inputAmount={inputBalance}
        setInputAmount={setInputBalance}
      />

      <div className="flex flex-col gap-[8px]">{beneficiaryField}</div>
      {encodedProposal && (
        <ExtrinsicInfo
          preimageHash={encodedHash}
          callData={encodedProposal}
          preimageLength={encodedLength || 0}
        />
      )}
      <InsufficientBalanceTips byteLength={encodedLength} onlyPreimage />
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </>
  );
}

export default function HydrationTreasurySpendPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Spend HOLLAR from treasury" onClose={onClose}>
      <TreasuryProvider>
        <PopupContent />
      </TreasuryProvider>
    </Popup>
  );
}
