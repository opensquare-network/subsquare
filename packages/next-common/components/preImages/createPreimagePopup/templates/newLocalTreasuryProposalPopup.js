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
import {
  getBeneficiaryParam,
  getNativeAssetKindParam,
} from "./batchTreasurySpendPopup";

function getCallArgType(call, index) {
  return call?.meta?.args?.[index]?.type?.toString() ?? "";
}

function buildAssetKindParam(spend) {
  // Hydration, Bifrost, ...
  if (getCallArgType(spend, 0) === "Null") {
    return null;
  }

  // AssetHub, Relay Chains, ...
  return getNativeAssetKindParam();
}

function buildBeneficiaryParam(spend, beneficiary) {
  const beneficiaryType = getCallArgType(spend, 2);
  const locatableAccount = getBeneficiaryParam(beneficiary);

  // AssetHub
  if (beneficiaryType.includes("VersionedLocatableAccount")) {
    return locatableAccount;
  }

  // Relay chains
  if (beneficiaryType.includes("VersionedLocation")) {
    return { V4: locatableAccount.V4.accountId };
  }

  // Hydration, Bifrost, ...
  return beneficiary;
}

function buildSpendLocalCall(api, bnValue, beneficiary) {
  return api.tx.treasury.spendLocal(bnValue.toFixed(), beneficiary);
}

function buildSpendCall(api, bnValue, beneficiary) {
  const spend = api.tx.treasury.spend;
  const args = [
    buildAssetKindParam(spend),
    bnValue.toFixed(),
    buildBeneficiaryParam(spend, beneficiary),
  ];

  if (spend.meta.args.length > 3) {
    args.push(null);
  }

  return spend(...args);
}

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
    } catch {
      return {};
    }

    try {
      let proposal;
      if (api.tx.treasury?.spendLocal) {
        proposal = buildSpendLocalCall(api, bnValue, beneficiary);
      } else if (api.tx.treasury?.spend) {
        proposal = buildSpendCall(api, bnValue, beneficiary);
      } else {
        return {};
      }
      return getState(api, proposal);
    } catch (e) {
      console.error("Failed to build treasury spend preimage:", e);
      return {};
    }
  }, [api, inputBalance, beneficiary, decimals]);
}

export default function NewLocalTreasuryProposalPopup() {
  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();

  const { notePreimageTx, encodedLength, encodedProposal, encodedHash } =
    useLocalTreasuryNotePreimageTx(inputBalance, beneficiary);

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
