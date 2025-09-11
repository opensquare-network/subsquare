import { useEffect, useState } from "react";
import WalletOption from "./walletOption";
import { useInjectedWeb3Extension } from "../../hooks/connect/useInjectedWeb3Extension";
import { useMountedState } from "react-use";

export default function SubstrateWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const [installed, setInstalled] = useState(null);
  const isMounted = useMountedState();
  const Logo = wallet.logo;
  const { injectedWeb3Extension, loading: loadingWeb3Extension } =
    useInjectedWeb3Extension(wallet?.extensionName);

  useEffect(() => {
    // update if installed changes
    if (loadingWeb3Extension) {
      return;
    }

    if (isMounted()) {
      setInstalled(!!injectedWeb3Extension);
    }
  }, [loadingWeb3Extension, isMounted, injectedWeb3Extension]);

  return (
    <WalletOption
      selected={selected}
      onClick={() => installed && onClick(wallet)}
      installed={installed}
      logo={<Logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      loading={loading}
    />
  );
}
