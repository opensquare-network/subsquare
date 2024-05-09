import Flex from "../styled/flex";
import Loading from "../loading";
import WalletOption from "./walletOption";
import { useNovaWalletSubstrateInstalled } from "next-common/hooks/connect/useNovaWalletInstalled";

export function NovaWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const novaWalletInstalled = useNovaWalletSubstrateInstalled();
  const Logo = wallet.logo;

  return (
    <WalletOption
      selected={selected}
      onClick={() => novaWalletInstalled && onClick(wallet)}
      installed={novaWalletInstalled}
    >
      <Flex>
        <Logo className={wallet.title} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </Flex>
      {novaWalletInstalled === false && (
        <span className="wallet-not-installed">Not installed</span>
      )}
      {(loading || novaWalletInstalled === null) && <Loading />}
    </WalletOption>
  );
}
