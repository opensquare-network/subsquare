import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import ProposeTree from "next-common/components/multisigs/signField/signSubmitPopup/proposeTree";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useSignApprove } from "../signApprove";
import SubmitButton from "next-common/components/common/tx/submitButton";

function SignApproveInnerPopup({ onClose, multisig }) {
  const { doSubmit, isDisabled } = useSignApprove(multisig);

  return (
    <Popup title="Multisig" onClose={onClose} maskClosable={false}>
      <SignerWithBalance noSwitchSigner />
      <ProposeTree callHex={multisig?.callHex} />
      <div className="flex justify-end">
        <SubmitButton onClick={doSubmit} loading={isDisabled}>
          Submit
        </SubmitButton>
      </div>
    </Popup>
  );
}

export default function SignApprovePopup({ onClose, multisig }) {
  return <SignApproveInnerPopup onClose={onClose} multisig={multisig} />;
}
