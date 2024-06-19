import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import { SignerContextProvider, usePopupParams } from "./context";
import DynamicLoginPopup from "next-common/components/login/dynamic";

export default function MaybeSignerConnected({ children, extensionAccounts }) {
  console.info(
    "🚀 ~ MaybeSignerConnected ~ extensionAccounts:",
    extensionAccounts,
  );
  const user = useUser();
  const { onClose } = usePopupParams();

  if (
    !user?.address ||
    !extensionAccounts?.find((acc) => isSameAddress(acc.address, user?.address))
  ) {
    return <DynamicLoginPopup onClose={onClose} showRegister={false} />;
  }

  return (
    <SignerContextProvider extensionAccounts={extensionAccounts}>
      {children}
    </SignerContextProvider>
  );
}
