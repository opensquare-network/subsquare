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
  const installed = useNovaWalletInstalled();
  const Logo = wallet.logo;

  return (
    <WalletOption
      selected={selected}
      onClick={() => installed && onClick(wallet)}
      installed={installed}
    >
      <Flex>
        <Logo className={wallet.title} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </Flex>
      {installed === false && (
        <span className="wallet-not-installed">Not installed</span>
      )}
      {(loading || installed === null) && <Loading />}
    </WalletOption>
  );
}
