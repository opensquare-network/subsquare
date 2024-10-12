import { OnChainProxiesProvider } from "next-common/context/proxy";
import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import { SignerContextProvider, usePopupParams } from "./context";
import LoginPopup from "next-common/components/login/popup";

export default function MaybeSignerConnected({ children, extensionAccounts }) {
  const user = useUser();
  const { onClose } = usePopupParams();

  if (
    !user?.address ||
    !extensionAccounts?.find((acc) => isSameAddress(acc.address, user?.address))
  ) {
    return <LoginPopup onClose={onClose} />;
  }

  return (
    <SignerContextProvider extensionAccounts={extensionAccounts}>
      <OnChainProxiesProvider>{children}</OnChainProxiesProvider>
    </SignerContextProvider>
  );
}
