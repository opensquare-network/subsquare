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

function PopupContent({ origin, role }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const connectedAddress =
    signerAccount?.proxyAddress || signerAccount?.address;
  const { parentBountyId, childBountyId } = useOnchainData();
  const { value: curator, component: curatorSelect } = useAddressComboField({
    title: "Curator",
  });

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!curator) {
        toastError("Curator address is required");
        return null;
      }

      if (!api?.tx?.multiAssetBounties?.proposeCurator) {
        toastError("Propose curator transaction is unavailable");
        return null;
      }

      const tx = api.tx.multiAssetBounties.proposeCurator(
        parentBountyId,
        childBountyId,
        curator,
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
      curator,
    ],
  );

  return (
    <>
      <UseConnectedAccountSigner />
      <SignerWithBalance noSwitchSigner />
      {curatorSelect}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <TxSubmissionButton title="Confirm" getTxFunc={getTxFuncForSubmit} />
    </>
  );
}

function ProposeCuratorPopup({ origin, role, ...props }) {
  return (
    <PopupWithSigner title="Propose Curator" {...props}>
      <PopupContent origin={origin} role={role} />
    </PopupWithSigner>
  );
}

export default function useProposeCuratorPopup(origin) {
  const [openRole, setOpenRole] = useState(null);

  return {
    showPopup: setOpenRole,
    popup: openRole ? (
      <ProposeCuratorPopup
        origin={origin}
        role={openRole}
        onClose={() => setOpenRole(null)}
      />
    ) : null,
  };
}
