import { useIsMetamaskWallet } from "next-common/hooks/connect/useIsMetamask";
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
  const isMetaMaskWallet = useIsMetamaskWallet();
  const Logo = wallet.logo;

  return (
    <WalletOption
      selected={selected}
      onClick={() => {
        enablePolkaGateSnap().then(() => {
          onClick?.(wallet);
        });
      }}
      installed={isMetaMaskWallet}
      logo={<Logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      loading={loading}
    />
  );
}
