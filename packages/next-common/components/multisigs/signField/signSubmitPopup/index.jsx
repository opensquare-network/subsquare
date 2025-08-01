import { useSignSubmitPopup } from "next-common/components/multisigs/context/signSubmitPopupContext";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SignSubmitPopup = dynamicPopup(() => import("./popup"));

export default function SignSubmitPopupInContext() {
  const {
    visible: SignSubmitPopupVisible,
    currentMultisig,
    setVisible,
  } = useSignSubmitPopup();

  if (!SignSubmitPopupVisible || !currentMultisig) {
    return null;
  }

  return (
    <SignSubmitPopup
      onClose={() => setVisible(false)}
      multisig={currentMultisig}
    />
  );
}
