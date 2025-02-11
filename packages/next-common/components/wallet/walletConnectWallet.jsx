import WalletOption from "./walletOption";

export default function WalletConnectWallet({ wallet, onClick }) {
  return (
    <WalletOption
      installed
      logo={<wallet.logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      onClick={onClick}
    />
  );
}
