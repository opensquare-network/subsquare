import { useEffect, useState } from "react";
import WalletOption from "./walletOption";
import { SystemLink } from "@osn/icons/subsquare";
import { useInjectedWeb3Extension } from "./useInjectedWeb3Extension";
import { useMountedState } from "react-use";

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
      notInstalledContent={
        isMultiSigWallet(wallet) && <MultiSigWalletUnavailable />
      }
    />
  );
}
