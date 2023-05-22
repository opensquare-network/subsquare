import React from "react";
import useExtensionAccounts from "../../utils/hooks/useExtensionAccounts";
import Popup from "../popup/wrapper/Popup";
import MaybeLogin from "../maybeLogin";
import { useMetaMaskAccounts } from "next-common/utils/metamask";
import { useChainSettings } from "next-common/context/chain";
import ChainTypes from "next-common/utils/consts/chainTypes";

export default function PopupWithAddress({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const { chainType } = useChainSettings();
  const { accounts: polkadotExtensionAccounts, detecting: extensionDetecting } =
    useExtensionAccounts("subsquare");
  const polkadotAccounts = polkadotExtensionAccounts.map((item) => ({
    ...item,
    name: item.meta.name,
  }));

  const metamaskAccounts = useMetaMaskAccounts(chainType === ChainTypes.ETHEREUM);
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
