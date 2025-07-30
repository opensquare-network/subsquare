import { useMyProxied } from "next-common/context/proxy";
import { useUser } from "next-common/context/user";
import { useState } from "react";
import { MultisigAccountsProvider } from "./multisigs/context/multisigAccountsContext";
import { useMultisigAccounts } from "./multisigs/context/multisigAccountsContext";
import SwitchSignerPopup from "./switchSignerPopup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function SwitchButton() {
  const user = useUser();
  const { proxies } = useMyProxied();

  if (!proxies.length && !user?.proxyAddress) {
    return null;
  }

  return <SwitchButtonContent supportedMultisig={false} />;
}

function MultisigSwitchButton() {
  const user = useUser();
  const { proxies } = useMyProxied();
  const { total: multisigTotal } = useMultisigAccounts();

  if (!proxies.length && !user?.proxyAddress && !multisigTotal) {
    return null;
  }

  return <SwitchButtonContent supportedMultisig />;
}

function SwitchButtonContent({ supportedMultisig }) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <span
        className="cursor-pointer text-theme500 text14Medium"
        onClick={() => setShowPopup(true)}
      >
        Switch
      </span>
      {showPopup && (
        <SwitchSignerPopup
          supportedMultisig={supportedMultisig}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

export default function SwitchButtonWrapper({ supportedMultisig = true }) {
  const realAddress = useRealAddress();

  if (supportedMultisig) {
    return (
      <MultisigAccountsProvider userAddress={realAddress}>
        <MultisigSwitchButton />
      </MultisigAccountsProvider>
    );
  }
  return <SwitchButton />;
}
