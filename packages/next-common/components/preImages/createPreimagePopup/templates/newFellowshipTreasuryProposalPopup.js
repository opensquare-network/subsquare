import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useChainSettings } from "next-common/context/chain";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import { addressToPublicKey } from "next-common/utils/address";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import { InfoMessage } from "next-common/components/setting/styled";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import NotePreimageButton from "../notePreimageButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";

const getAssetKindParam = () => {
  return {
    V3: {
      location: {
        parents: 1,
        interior: {
          X1: {
            Parachain: 1000,
          },
        },
      },
      assetId: {
        Concrete: {
          parents: 1,
          interior: {
            here: null,
          },
        },
      },
    },
  };
};

const getBeneficiaryParam = (beneficiary) => {
  return {
    V3: {
      parents: 0,
      interior: {
        X1: {
          AccountId32: {
            network: null,
            id: "0x" + addressToPublicKey(beneficiary),
          },
        },
      },
    },
  };
};

export function useAssetHubNativeTreasuryNotePreimageTx(
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
      const proposal = api.tx.fellowshipTreasury.spend(
        getAssetKindParam(),
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

export default function NewFellowshipTreasuryProposalPopup() {
  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();

  const { notePreimageTx, encodedLength } =
    useAssetHubNativeTreasuryNotePreimageTx(
      inputBalance,
      beneficiary,
      validFrom,
    );

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose}>
      <SignerWithBalance />
      {balanceField}
      <div className="flex flex-col gap-[8px]">
        {beneficiaryField}
        <InfoMessage>
          Please input an AssetHub address as the beneficiary
        </InfoMessage>
      </div>
      <AdvanceSettings>{validFromField}</AdvanceSettings>
      <InsufficientBalanceTips byteLength={encodedLength} onlyPreimage />
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </Popup>
  );
}
