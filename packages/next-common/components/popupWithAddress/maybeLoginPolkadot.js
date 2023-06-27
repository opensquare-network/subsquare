import React, { useEffect, useState } from "react";
import MaybeLogin from "../maybeLogin";
import useInjectedWeb3 from "../wallet/useInjectedWeb3";
import Popup from "../popup/wrapper/Popup";

export default function MaybeLoginPolkadot({
  onClose,
  autoCloseAfterLogin,
  title,
  Component,
  ...props
}) {
  const { injectedWeb3 } = useInjectedWeb3();
  const [polkadotAccounts, setPolkadotAccounts] = useState([]);

  useEffect(() => {
    (async () => {
      if (!injectedWeb3) {
        return;
      }

      const extensionName = localStorage.lastLoginExtension;
      const extension = injectedWeb3?.[extensionName];

      if (!extension) {
        return;
      }

      try {
        const wallet = await extension.enable("subsquare");
        let extensionAccounts = await wallet.accounts?.get();
        setPolkadotAccounts(
          extensionAccounts.map((item) => ({
            ...item,
            meta: {
              name: item.name,
              source: extensionName,
            },
          })),
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, [injectedWeb3]);

  return (
    <MaybeLogin
      accounts={polkadotAccounts}
      onClose={onClose}
      autoCloseAfterLogin={autoCloseAfterLogin}
    >
      <Popup onClose={onClose} title={title}>
        <Component
          onClose={onClose}
          extensionAccounts={polkadotAccounts}
          {...props}
        />
      </Popup>
    </MaybeLogin>
  );
}
