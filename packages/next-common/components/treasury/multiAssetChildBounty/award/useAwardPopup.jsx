import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useState } from "react";
import { useOnchainData } from "next-common/context/post";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import { addressToPublicKey } from "next-common/utils/address";

function getBeneficiaryParam(beneficiary) {
  return {
    V5: {
      location: {
        parents: 0,
        interior: "Here",
      },
      accountId: {
        parents: 0,
        interior: {
          X1: [
            {
              AccountId32: {
                network: null,
                id: `0x${addressToPublicKey(beneficiary)}`,
              },
            },
          ],
        },
      },
    },
  };
}

function PopupContent() {
  const api = useConditionalContextApi();
  const { parentBountyId, childBountyId } = useOnchainData();
  const { value: beneficiary, component: beneficiarySelect } =
    useAddressComboField({ title: "Beneficiary" });

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!beneficiary) {
        toastError("Beneficiary address is required");
        return null;
      }

      if (!api?.tx?.multiAssetBounties?.awardBounty) {
        toastError("Award bounty transaction is unavailable");
        return null;
      }

      let beneficiaryParam;
      try {
        beneficiaryParam = getBeneficiaryParam(beneficiary);
      } catch {
        toastError("Beneficiary address is invalid");
        return null;
      }

      return api.tx.multiAssetBounties.awardBounty(
        parentBountyId,
        childBountyId,
        beneficiaryParam,
      );
    },
    [api, parentBountyId, childBountyId, beneficiary],
  );

  return (
    <>
      <SignerWithBalance />
      {beneficiarySelect}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton
          api={api}
          title="Confirm"
          getTxFunc={getTxFuncForSubmit}
        />
      </div>
    </>
  );
}

function AwardPopup(props) {
  return (
    <PopupWithSigner title="Award Child Bounty" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}

export default function useAwardPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    showPopup: () => setIsOpen(true),
    popup: isOpen ? <AwardPopup onClose={() => setIsOpen(false)} /> : null,
  };
}
