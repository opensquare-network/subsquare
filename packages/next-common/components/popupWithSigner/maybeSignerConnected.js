import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import LoginPopup from "../login/popup";
import { SignerContextProvider, usePopupParams } from "./context";

export default function MaybeSignerConnected({ children, extensionAccounts }) {
  const user = useUser();
  const { onClose } = usePopupParams();

  if (
    !user?.address ||
    !extensionAccounts?.find((acc) => isSameAddress(acc.address, user?.address))
  ) {
    return <LoginPopup onClose={onClose} showRegister={false} />;
  }

  return (
    <SignerContextProvider extensionAccounts={extensionAccounts}>
      {children}
    </SignerContextProvider>
  );
}
