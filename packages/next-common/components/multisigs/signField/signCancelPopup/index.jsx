import { useSignCancelPopup } from "../../context/signCancelPopupContext";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SignCancelPopup = dynamicPopup(() => import("./popup"));

export default function SignCancelPopupInContext() {
  const { visible, setVisible, currentMultisig } = useSignCancelPopup();

  if (!visible || !currentMultisig) {
    return null;
  }

  return (
    <SignCancelPopup
      onClose={() => setVisible(false)}
      multisig={currentMultisig}
    />
  );
}
