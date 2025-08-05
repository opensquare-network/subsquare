import { useState } from "react";
import { MultisigAccountsProvider } from "./multisigs/context/multisigAccountsContext";
import SwitchSignerPopup from "./switchSignerPopup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";

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
  const api = useContextApi();

  if (!api) {
    return null;
  }

  if (supportedMultisig) {
    return (
      <MultisigAccountsProvider userAddress={realAddress}>
        <SwitchButtonContent supportedMultisig />
      </MultisigAccountsProvider>
    );
  }
  return <SwitchButtonContent supportedMultisig={false} />;
}
