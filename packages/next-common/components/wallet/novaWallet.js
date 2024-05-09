import Flex from "../styled/flex";
import Loading from "../loading";
import WalletOption from "./walletOption";
import { useNovaWalletInstalled } from "next-common/hooks/connect/useNovaWalletInstalled";

export function NovaWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const novaWalletInstalled = useNovaWalletInstalled();
  const Logo = wallet.logo;

  return (
    <WalletOption
      selected={selected}
      onClick={() => novaWalletInstalled.substrate && onClick(wallet)}
      installed={novaWalletInstalled.substrate}
    >
      <Flex>
        <Logo className={wallet.title} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </Flex>
      {novaWalletInstalled.substrate === false && (
        <span className="wallet-not-installed">Not installed</span>
      )}
      {(loading || novaWalletInstalled.substrate === null) && <Loading />}
    </WalletOption>
  );
}
