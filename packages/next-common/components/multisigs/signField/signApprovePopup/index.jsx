import { useSignApprovePopup } from "../../context/signApprovePopupContext";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SignApprovePopup = dynamicPopup(() => import("./popup"));

export default function SignApprovePopupInContext() {
  const { visible, setVisible, currentMultisig } = useSignApprovePopup();

  if (!visible || !currentMultisig) {
    return null;
  }

  return (
    <SignApprovePopup
      onClose={() => setVisible(false)}
      multisig={currentMultisig}
    />
  );
}
