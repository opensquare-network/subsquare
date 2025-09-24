import Signer from "next-common/components/popup/fields/signerField";
import {
  usePopupParams,
  useSignerContext,
} from "next-common/components/popupWithSigner/context";
import { useMount } from "react-use";
import { MultisigBalanceProvider, useMultisigBalance } from "./context";

function MultisigPopupWrapperContent({ children }) {
  const { balance, loading: loadingBalance } = useMultisigBalance();

  return (
    <>
      <Signer
        title="Origin"
        balance={balance?.transferrable}
        isBalanceLoading={loadingBalance}
        noSwitchSigner
        showTransferable
        supportedMultisig
      />
      {children}
    </>
  );
}

export default function MultisigPopupWrapper({ children }) {
  const { multisig } = usePopupParams();
  const { setSelectedProxyAddress, setMultisig } = useSignerContext();

  useMount(() => {
    setSelectedProxyAddress();
    setMultisig(multisig);
  });

  return (
    <MultisigBalanceProvider multisig={multisig}>
      <MultisigPopupWrapperContent>{children}</MultisigPopupWrapperContent>
    </MultisigBalanceProvider>
  );
}
