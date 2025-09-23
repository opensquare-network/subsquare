import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import ProposeTree from "next-common/components/multisigs/signField/signSubmitPopup/proposeTree";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Popup from "next-common/components/popup/wrapper/Popup";
import { SignApprovePopupProvider } from "../../context/signApprovePopupContext";

function SignApproveInnerPopup({ onClose, multisig }) {
  const api = useContextApi();
  const realAddress = useRealAddress();

  const getTxFunc = () => {
    if (!api || !realAddress || !multisig) {
      return;
    }

    return api.tx.multisig.approveAsMulti(
      multisig.threshold,
      multisig.otherSignatories,
      multisig.when,
      multisig.callHash,
      multisig.callData ? { weight: multisig.callData.weight } : null,
    );
  };

  return (
    <Popup title="Multisig" onClose={onClose} maskClosable={false}>
      <SignerWithBalance />
      <ProposeTree callHex={multisig?.callHex} when={multisig?.when} />
      <TxSubmissionButton getTxFunc={getTxFunc} onClose={onClose} />
    </Popup>
  );
}

export default function SignApprovePopup({ onClose, multisig }) {
  return (
    <MigrationConditionalApiProvider>
      <SignerPopupWrapper onClose={onClose}>
        <SignApprovePopupProvider>
          <SignApproveInnerPopup onClose={onClose} multisig={multisig} />
        </SignApprovePopupProvider>
      </SignerPopupWrapper>
    </MigrationConditionalApiProvider>
  );
}
