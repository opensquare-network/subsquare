import { useHasMetamask } from "next-common/hooks/connect/useHasMetamask";
import WalletOption from "./walletOption";
import useInjectedWeb3 from "./useInjectedWeb3";

// Added for supporting PolkaGate Snap
async function enablePolkaGateSnap() {
  if (typeof window !== "undefined") {
    const { web3Enable } = await import("@polkagate/extension-dapp");
    web3Enable("snaponly");
  }
}

export default function PolkagateSnapWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const hasMetamask = useHasMetamask();
  const { setInjectedWeb3 } = useInjectedWeb3();
  const Logo = wallet.logo;

  return (
    <WalletOption
      selected={selected}
      onClick={() => {
        if (!hasMetamask) {
          // this option should already be disabled
          return;
        }

        enablePolkaGateSnap().then(() => {
          setInjectedWeb3(window.injectedWeb3);
          onClick?.(wallet);
        });
      }}
      installed={hasMetamask}
      logo={<Logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      loading={loading}
    />
  );
}
