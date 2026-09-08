import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useState } from "react";
import { useOnchainData } from "next-common/context/post";
import { UseConnectedAccountSigner } from "next-common/components/treasury/multiAssetBounty/acceptCurator/useAcceptCuratorPopup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { wrapTxByRole } from "next-common/utils/sendTransaction/wrapTxByRole";
import { useContextApi } from "next-common/context/api";
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

function PopupContent({ origin, role }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const connectedAddress =
    signerAccount?.proxyAddress || signerAccount?.address;
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

      const tx = api.tx.multiAssetBounties.awardBounty(
        parentBountyId,
        childBountyId,
        beneficiaryParam,
      );
      return wrapTxByRole(api, { role, tx, connectedAddress, origin });
    },
    [
      api,
      role,
      connectedAddress,
      origin,
      parentBountyId,
      childBountyId,
      beneficiary,
    ],
  );

  return (
    <>
      <UseConnectedAccountSigner />
      <SignerWithBalance noSwitchSigner />
      {beneficiarySelect}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <TxSubmissionButton title="Confirm" getTxFunc={getTxFuncForSubmit} />
    </>
  );
}

function AwardPopup({ origin, role, ...props }) {
  return (
    <PopupWithSigner title="Award Child Bounty" {...props}>
      <PopupContent origin={origin} role={role} />
    </PopupWithSigner>
  );
}

export default function useAwardPopup(origin) {
  const [openRole, setOpenRole] = useState(null);

  return {
    showPopup: setOpenRole,
    popup: openRole ? (
      <AwardPopup
        origin={origin}
        role={openRole}
        onClose={() => setOpenRole(null)}
      />
    ) : null,
  };
}
