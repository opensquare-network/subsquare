import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import ProposeTree from "next-common/components/multisigs/signField/signSubmitPopup/proposeTree";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useSignCancel } from "../signCancel";
import PrimaryButton from "next-common/lib/button/primary";

function SignCancelInnerPopup({ onClose, multisig }) {
  const { doSubmit, isDisabled } = useSignCancel(multisig);

  return (
    <Popup title="Multisig" onClose={onClose} maskClosable={false}>
      <SignerWithBalance />
      <ProposeTree callHex={multisig?.callHex} when={multisig?.when} />
      <div className="flex justify-end">
        <PrimaryButton onClick={doSubmit} loading={isDisabled}>
          Cancel
        </PrimaryButton>
      </div>
    </Popup>
  );
}

export default function SignCancelPopup({ onClose, multisig }) {
  return (
    <MigrationConditionalApiProvider>
      <SignCancelInnerPopup onClose={onClose} multisig={multisig} />
    </MigrationConditionalApiProvider>
  );
}
