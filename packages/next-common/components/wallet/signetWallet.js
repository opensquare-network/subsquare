import { useSignetSdk } from "next-common/context/signet";
import { signet } from "next-common/utils/consts/connect";
import WalletOption from "./walletOption";

export function SignetWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const data = useSignetSdk();
  const { inSignet: installed } = data;
  const Logo = wallet.logo;

  return (
    <WalletOption
      selected={selected}
      onClick={() => installed && onClick(wallet)}
      installed={installed}
      logo={<Logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      loading={loading}
      installUrl={signet.installUrl}
    />
  );
}
