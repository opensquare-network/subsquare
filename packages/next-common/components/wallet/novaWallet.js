import { useEffect, useState } from "react";
import useIsMounted from "../../utils/hooks/useIsMounted";
import useInjectedWeb3 from "./useInjectedWeb3";
import WalletOption from "./walletOption";
import { isNil } from "lodash-es";

export function NovaWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const [installed, setInstalled] = useState(null);
  const { loading: loadingInjectedWeb3, injectedWeb3 } = useInjectedWeb3();
  const isMounted = useIsMounted();
  const Logo = wallet.logo;

  useEffect(() => {
    // update if installed changes
    if (loadingInjectedWeb3) {
      return;
    }

    if (isMounted.current) {
      const installed =
        !isNil(injectedWeb3?.["polkadot-js"]) &&
        window.walletExtension?.isNovaWallet === true;
      setInstalled(installed);
    }
  }, [loadingInjectedWeb3, injectedWeb3, wallet?.extensionName, isMounted]);

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
