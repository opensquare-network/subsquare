import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import ProposeTree from "next-common/components/multisigs/signField/signSubmitPopup/proposeTree";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useSignCancel } from "../signCancel";
import SubmitButton from "next-common/components/common/tx/submitButton";

function SignCancelInnerPopup({ onClose, multisig }) {
  const { doSubmit, isDisabled } = useSignCancel(multisig);

  return (
    <Popup title="Multisig" onClose={onClose} maskClosable={false}>
      <SignerWithBalance noSwitchSigner />
      <ProposeTree callHex={multisig?.callHex} />
      <div className="flex justify-end">
        <SubmitButton onClick={doSubmit} loading={isDisabled}>
          Cancel
        </SubmitButton>
      </div>
    </Popup>
  );
}

export default function SignCancelPopup({ onClose, multisig }) {
  return <SignCancelInnerPopup onClose={onClose} multisig={multisig} />;
}
