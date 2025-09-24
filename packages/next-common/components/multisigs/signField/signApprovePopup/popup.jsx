import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import ProposeTree from "next-common/components/multisigs/signField/signSubmitPopup/proposeTree";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useSignApprove } from "../signApprove";
import PrimaryButton from "next-common/lib/button/primary";

function SignApproveInnerPopup({ onClose, multisig }) {
  const { doSubmit, isDisabled } = useSignApprove(multisig);

  return (
    <Popup title="Multisig" onClose={onClose} maskClosable={false}>
      <SignerWithBalance />
      <ProposeTree callHex={multisig?.callHex} when={multisig?.when} />
      <div className="flex justify-end">
        <PrimaryButton onClick={doSubmit} loading={isDisabled}>
          Submit
        </PrimaryButton>
      </div>
    </Popup>
  );
}

export default function SignApprovePopup({ onClose, multisig }) {
  return (
    <MigrationConditionalApiProvider>
      <SignApproveInnerPopup onClose={onClose} multisig={multisig} />
    </MigrationConditionalApiProvider>
  );
}
