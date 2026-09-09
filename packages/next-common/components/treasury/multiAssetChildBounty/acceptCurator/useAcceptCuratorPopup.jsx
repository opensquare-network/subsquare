import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
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
  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      const txApi = api?.tx?.multiAssetBounties;
      if (!txApi?.acceptCurator) {
        toastError("Accept curator transaction is unavailable");
        return null;
      }

      const tx = txApi.acceptCurator(parentBountyId, childBountyId);
      return wrapTxByRole(api, { role, tx, connectedAddress, origin });
    },
    [api, role, connectedAddress, origin, parentBountyId, childBountyId],
  );

  return (
    <>
      <UseConnectedAccountSigner />
      <SignerWithBalance noSwitchSigner />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <TxSubmissionButton title="Confirm" getTxFunc={getTxFuncForSubmit} />
    </>
  );
}

function AcceptCuratorPopup({ origin, role, ...props }) {
  return (
    <PopupWithSigner title="Accept Curator" {...props}>
      <PopupContent origin={origin} role={role} />
    </PopupWithSigner>
  );
}

export default function useAcceptCuratorPopup(origin) {
  const [openRole, setOpenRole] = useState(null);

  return {
    showPopup: setOpenRole,
    popup: openRole ? (
      <AcceptCuratorPopup
        origin={origin}
        role={openRole}
        onClose={() => setOpenRole(null)}
      />
    ) : null,
  };
}
