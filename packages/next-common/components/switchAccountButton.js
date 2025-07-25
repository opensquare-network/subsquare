import { useMyProxied } from "next-common/context/proxy";
import { useUser } from "next-common/context/user";
import { useState } from "react";
import { AccountsProvider as MultisigAccountsProvider } from "./multisigs/context/accountsContext";
import { useMultisigAccounts } from "./multisigs/context/accountsContext";
import SwitchSignerPopup from "./switchSignerPopup";

function SwitchButton() {
  const user = useUser();
  const { proxies } = useMyProxied();

  if (!proxies.length && !user?.proxyAddress) {
    return null;
  }

  return <SwitchButtonContent />;
}

function MultisigSwitchButton() {
  const user = useUser();
  const { proxies } = useMyProxied();
  const { total: multisigTotal } = useMultisigAccounts();

  if (!proxies.length && !user?.proxyAddress && !multisigTotal) {
    return null;
  }

  return <SwitchButtonContent />;
}

function SwitchButtonContent() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <span
        className="cursor-pointer text-theme500 text14Medium"
        onClick={() => setShowPopup(true)}
      >
        Switch
      </span>
      {showPopup && <SwitchSignerPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}

export default function SwitchButtonWrapper({ supportedMultisig = true }) {
  if (supportedMultisig) {
    return (
      <MultisigAccountsProvider>
        <MultisigSwitchButton />
      </MultisigAccountsProvider>
    );
  }
  return <SwitchButton />;
}
