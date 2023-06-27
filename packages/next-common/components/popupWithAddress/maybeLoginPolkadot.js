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
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    (async () => {
      if (!injectedWeb3) {
        return;
      }

      const extensionName = localStorage.lastLoginExtension;
      const extension = injectedWeb3?.[extensionName];

      if (!extension) {
        setDetecting(false);
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

      setDetecting(false);
    })();
  }, [injectedWeb3]);

  if (detecting) {
    return null;
  }

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
