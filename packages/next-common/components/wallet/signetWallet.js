import WalletOption from "./walletOption";
import { useSignetSdk } from "next-common/context/signet";
import { SystemLink } from "@osn/icons/subsquare";

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
      notInstalledContent={
        <a
          href="https://www.talisman.xyz/signet"
          target="_blank"
          rel="noreferrer"
        >
          <SystemLink className="text-theme500 !w-[20px] !h-[20px]" />
        </a>
      }
    />
  );
}
