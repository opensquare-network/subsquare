import AddressComboField from "next-common/components/popup/fields/addressComboField";
import BalanceField from "next-common/components/popup/fields/balanceField";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo, useState } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

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
  }, [api, inputBalance, beneficiary]);
}

export default function NewLocalTreasuryProposalPopup({ onClose }) {
  const [inputBalance, setInputBalance] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();

  const { notePreimageTx } = useLocalTreasuryNotePreimageTx(
    inputBalance,
    beneficiary,
  );

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose} wide>
      <SignerWithBalance title="Origin" />
      <BalanceField
        title="Request"
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
      />
      <AddressComboField
        title="Beneficiary"
        extensionAccounts={extensionAccounts}
        defaultAddress={realAddress}
        setAddress={setBeneficiary}
      />
      <div className="flex justify-end">
        <TxSubmissionButton
          getTxFunc={() => notePreimageTx}
          onClose={onClose}
        />
      </div>
    </Popup>
  );
}
