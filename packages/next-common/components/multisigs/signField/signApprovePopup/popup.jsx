import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import ProposeTree from "next-common/components/multisigs/signField/signSubmitPopup/proposeTree";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useSignApprovePopup } from "../../context/signApprovePopupContext";
import { useMultisigListFetchFunc } from "next-common/components/multisigs/actions/composeCallPopup/fetchMultisigList";

function SignApproveInnerPopup({ onClose, multisig }) {
  const { getTxFunc } = useSignApprovePopup();
  const fetchMultisigListFunc = useMultisigListFetchFunc();

  return (
    <Popup title="Multisig" onClose={onClose} maskClosable={false}>
      <SignerWithBalance />
      <ProposeTree callHex={multisig?.callHex} when={multisig?.when} />
      <TxSubmissionButton
        getTxFunc={() => getTxFunc(multisig)}
        onFinalized={fetchMultisigListFunc}
      />
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
