import { useEffect, useState } from "react";
import useIsMounted from "../../utils/hooks/useIsMounted";
import useInjectedWeb3 from "./useInjectedWeb3";
import WalletOption from "./walletOption";
import { SystemLink } from "@osn/icons/subsquare";

function isMultiSigWallet(wallet) {
  return wallet?.extensionName === "mimir";
}

function MultiSigWalletUnavailable() {
  return (
    <div className="flex items-center">
      <a href="https://mimir.global/" target="_blank" rel="noreferrer">
        <SystemLink className="[&_path]:fill-theme500 !w-[20px] !h-[20px]" />
      </a>
    </div>
  );
}

export default function PolkadotWallet({
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
      setInstalled(!!injectedWeb3?.[wallet?.extensionName]);
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
      notInstalledContent={
        isMultiSigWallet(wallet) && <MultiSigWalletUnavailable />
      }
    />
  );
}
