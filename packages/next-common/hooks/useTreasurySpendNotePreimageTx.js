import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";

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
      const proposal = api.tx.treasury.spend(
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
