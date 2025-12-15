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
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { STABLE_CURRENCY } from "next-common/utils/consts/hydration";
import { isNil } from "lodash-es";

export function useHydrationTreasurySpendPreimageTx(
  inputBalance,
  decimals,
  beneficiary,
) {
  const api = useContextApi();

  return useMemo(() => {
    if (!api || !inputBalance || !beneficiary || isNil(decimals)) {
      return {};
    }

    let bnValue;
    try {
      bnValue = checkInputValue(inputBalance, decimals);
    } catch (err) {
      return {};
    }

    try {
      const transferTx = api.tx.currencies.transfer(
        beneficiary,
        STABLE_CURRENCY.id,
        bnValue.toFixed(),
      );
      const proposal = api.tx.dispatcher.dispatchWithExtraGas(
        transferTx,
        1000000,
      );
      const treasuryProposal = api.tx.dispatcher.dispatchAsTreasury(proposal);

      return getState(api, treasuryProposal);
    } catch (e) {
      console.error(e);
      return {};
    }
  }, [api, inputBalance, decimals, beneficiary]);
}

function PopupContent() {
  const [inputBalance, setInputBalance] = useState("");
  const realAddress = useRealAddress();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField({ defaultAddress: realAddress });
  const { data: currencyInfo, loading } = useHydrationCurrencyInfo(
    STABLE_CURRENCY.id,
  );

  const { notePreimageTx, encodedLength, encodedProposal, encodedHash } =
    useHydrationTreasurySpendPreimageTx(
      inputBalance,
      currencyInfo?.decimals,
      beneficiary,
    );

  return (
    <>
      <SignerWithBalance />
      <AmountInputWithHint
        label="Request"
        hintLabel="Available"
        hintTooltip="Available treasury balance"
        maxAmount={currencyInfo?.treasuryBalance}
        decimals={currencyInfo?.decimals}
        symbol={currencyInfo?.symbol}
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
    <Popup title="Stable treasury spend proposal" onClose={onClose}>
      <TreasuryProvider>
        <PopupContent />
      </TreasuryProvider>
    </Popup>
  );
}
