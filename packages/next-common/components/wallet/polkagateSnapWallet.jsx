import { usePolkagateSnapEnabled } from "next-common/hooks/connect/usePolkagateSnapEnabled";
import useInjectedWeb3 from "../../hooks/connect/useInjectedWeb3";
import WalletOption from "./walletOption";

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
  const enabled = usePolkagateSnapEnabled();
  const { setInjectedWeb3 } = useInjectedWeb3();
  const Logo = wallet.logo;

  return (
    <WalletOption
      selected={selected}
      onClick={() => {
        if (!enabled) {
          // this option should already be disabled
          return;
        }

        enablePolkaGateSnap().then(() => {
          setInjectedWeb3(window.injectedWeb3);
          onClick?.(wallet);
        });
      }}
      installed={enabled}
      logo={<Logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      loading={loading}
    />
  );
}
