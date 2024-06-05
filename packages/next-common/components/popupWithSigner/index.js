import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import MaybePolkadotSigner from "./maybePolkadotSigner";
import MaybeMetamaskSigner from "./maybeMetamaskSigner";
import MaybeSignetSigner from "./maybeSignetSigner";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import CanBeAnyWalletSigner from "./canBeAnyWalletSigner";
import { isKeyRegisteredUser } from "next-common/utils";
import { PopupParamsProvider, usePopupParams } from "./context";
import LoginPopup from "../login/popup";

function PopupImpl({ children }) {
  const user = useUser();
  const { connectedAccount, lastConnectedAccount } =
    useConnectedAccountContext();
  const { onClose } = usePopupParams();

  if (!user) {
    return <LoginPopup onClose={onClose} showRegister={false} />;
  }

  if (!isKeyRegisteredUser(user) && !connectedAccount) {
    return <CanBeAnyWalletSigner>{children}</CanBeAnyWalletSigner>;
  }

  if (lastConnectedAccount?.wallet === WalletTypes.METAMASK) {
    return <MaybeMetamaskSigner>{children}</MaybeMetamaskSigner>;
  }

  if (lastConnectedAccount?.wallet === WalletTypes.SIGNET) {
    return <MaybeSignetSigner>{children}</MaybeSignetSigner>;
  }

  return <MaybePolkadotSigner>{children}</MaybePolkadotSigner>;
}

export default function PopupWithSigner({ children, ...props }) {
  return (
    <PopupParamsProvider {...props}>
      <PopupImpl>{children}</PopupImpl>
    </PopupParamsProvider>
  );
}
