import React from "react";
import useExtensionAccounts from "../../utils/hooks/useExtensionAccounts";
import Popup from "../popup/wrapper/Popup";
import MaybeLogin from "../maybeLogin";
import { useMetaMaskAccounts } from "next-common/utils/metamask";
import { useChainSettings } from "next-common/context/chain";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { isEthereumAddress } from "@polkadot/util-crypto";

export default function PopupWithAddress({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const loginUser = useUser();
  const lastLoginExtension = localStorage.lastLoginExtension;
  const { chainType } = useChainSettings();
  const { accounts: polkadotExtensionAccounts, detecting: extensionDetecting } =
    useExtensionAccounts("subsquare");
  const polkadotAccounts = polkadotExtensionAccounts.map((item) => ({
    ...item,
    name: item.meta.name,
  }));

  const metamaskActive =
    chainType === ChainTypes.ETHEREUM &&
    loginUser &&
    isEthereumAddress(loginUser.address) &&
    lastLoginExtension === WalletTypes.METAMASK;
  const metamaskAccounts = useMetaMaskAccounts(metamaskActive);
  const extensionAccounts = [...polkadotAccounts, ...metamaskAccounts];

  if (extensionDetecting) {
    return null;
  }

  return (
    <MaybeLogin
      polkadotAccounts={polkadotAccounts}
      metamaskAccounts={metamaskAccounts}
      onClose={onClose}
      autoCloseAfterLogin={autoCloseAfterLogin}
    >
      <Popup onClose={onClose} title={title}>
        <Component
          onClose={onClose}
          extensionAccounts={extensionAccounts}
          {...props}
        />
      </Popup>
    </MaybeLogin>
  );
}
