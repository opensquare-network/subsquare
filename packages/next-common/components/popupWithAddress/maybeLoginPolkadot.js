import React, { useEffect, useState } from "react";
import MaybeLogin from "../maybeLogin";
import useInjectedWeb3 from "../wallet/useInjectedWeb3";
import Popup from "../popup/wrapper/Popup";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useConnectedAddress } from "next-common/context/connectedAddress";

export default function MaybeLoginPolkadot({
  onClose,
  autoCloseAfterLogin,
  title,
  Component,
  ...props
}) {
  const dispatch = useDispatch();
  const { injectedWeb3, loading } = useInjectedWeb3();
  const [polkadotAccounts, setPolkadotAccounts] = useState([]);
  const [detecting, setDetecting] = useState(true);
  const connectedAddress = useConnectedAddress();

  useEffect(() => {
    (async () => {
      if (loading) {
        return;
      }

      if (!connectedAddress) {
        return;
      }

      try {
        if (!injectedWeb3) {
          return;
        }

        const extension = injectedWeb3?.[connectedAddress?.extensionName];

        if (!extension) {
          return;
        }

        const wallet = await extension.enable("subsquare");
        const extensionAccounts = await wallet.accounts?.get();
        setPolkadotAccounts(
          extensionAccounts.map((item) => ({
            ...item,
            meta: {
              name: item.name,
              source: connectedAddress?.extensionName,
            },
          })),
        );
      } catch (e) {
        dispatch(newErrorToast(e.message));
        onClose();
      } finally {
        setDetecting(false);
      }
    })();
  }, [injectedWeb3, loading, connectedAddress]);

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
