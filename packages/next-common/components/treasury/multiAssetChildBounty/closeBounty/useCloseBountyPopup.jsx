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
import { InfoMessage } from "next-common/components/setting/styled";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { getEventData } from "next-common/utils/sendTransaction";

function PopupContent({ origin, role }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const connectedAddress =
    signerAccount?.proxyAddress || signerAccount?.address;
  const { parentBountyId, childBountyId } = useOnchainData();

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api?.tx?.multiAssetBounties?.closeBounty) {
        toastError("Close bounty transaction is unavailable");
        return null;
      }

      // close_bounty(parent_bounty_id, child_bounty_id)
      const tx = api.tx.multiAssetBounties.closeBounty(
        parentBountyId,
        childBountyId,
      );
      return wrapTxByRole(api, { role, tx, connectedAddress, origin });
    },
    [api, role, connectedAddress, origin, parentBountyId, childBountyId],
  );

  return (
    <>
      <UseConnectedAccountSigner />
      <SignerWithBalance noSwitchSigner />
      <InfoMessage>
        Closing this child bounty will refund its funds to the parent bounty.
      </InfoMessage>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFuncForSubmit}
        onInBlock={({ events }) => {
          if (
            role?.kind === "multisig" &&
            getEventData(events, "multisig", "NewMultisig")
          ) {
            dispatch(
              newSuccessToast(
                "Multisig transaction submitted. Waiting for other signatories.",
              ),
            );
          }
        }}
      />
    </>
  );
}

function CloseBountyPopup({ origin, role, ...props }) {
  return (
    <PopupWithSigner title="Close Child Bounty" {...props}>
      <PopupContent origin={origin} role={role} />
    </PopupWithSigner>
  );
}

export default function useCloseBountyPopup(origin) {
  const [openRole, setOpenRole] = useState(null);

  return {
    showPopup: setOpenRole,
    popup: openRole ? (
      <CloseBountyPopup
        origin={origin}
        role={openRole}
        onClose={() => setOpenRole(null)}
      />
    ) : null,
  };
}
