import { GeneralProxiesProvider } from "next-common/context/proxy";
import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import { SignerContextProvider, usePopupParams } from "./context";
import LoginPopup from "next-common/components/login/popup";
import { isMockAccountAddress } from "next-common/utils/mockAccount";

export default function MaybeSignerConnected({ children, extensionAccounts }) {
  const user = useUser();
  const { onClose } = usePopupParams();

  if (
    !user?.address ||
    (!isMockAccountAddress(user?.address) &&
      !extensionAccounts?.find((acc) =>
        isSameAddress(acc.address, user?.address),
      ))
  ) {
    return <LoginPopup onClose={onClose} />;
  }

  return (
    <SignerContextProvider extensionAccounts={extensionAccounts}>
      <GeneralProxiesProvider>{children}</GeneralProxiesProvider>
    </SignerContextProvider>
  );
}
