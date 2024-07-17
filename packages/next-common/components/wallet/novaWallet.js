import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import WalletOption from "./walletOption";
import { isNil } from "lodash-es";
import { useInjectedWeb3Extension } from "./useInjectedWeb3Extension";
import WalletTypes from "next-common/utils/consts/walletTypes";

export function NovaWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const [installed, setInstalled] = useState(null);
  const isMounted = useMountedState();
  const Logo = wallet.logo;
  const { injectedWeb3Extension } = useInjectedWeb3Extension(
    WalletTypes.POLKADOT_JS,
  );

  useEffect(() => {
    if (isMounted()) {
      const installed =
        !isNil(injectedWeb3Extension) &&
        window.walletExtension?.isNovaWallet === true;
      setInstalled(installed);
    }
  }, [injectedWeb3Extension, wallet?.extensionName, isMounted]);

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
