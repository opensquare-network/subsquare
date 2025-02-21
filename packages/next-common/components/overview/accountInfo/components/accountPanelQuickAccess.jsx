import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useChainSettings } from "next-common/context/chain";
import SecondaryButton from "next-common/lib/button/secondary";
import Link from "next/link";

const MenuProxy = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.MenuProxy),
);
const MenuMultisig = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.MenuMultisig),
);
const ArrowRight = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.ArrowRight),
);

function ProxyButton() {
  const {
    modules: { proxy },
  } = useChainSettings();

  if (!proxy) {
    return null;
  }

  return (
    <Link href="/account/proxies">
      <SecondaryButton
        size="small"
        iconLeft={<MenuProxy className="w-4 h-4 text-textTertiary" />}
        iconRight={<ArrowRight className="w-4 h-4 text-textTertiary" />}
      >
        Proxy
      </SecondaryButton>
    </Link>
  );
}

function MultisigButton() {
  const { hasMultisig } = useChainSettings();

  if (!hasMultisig) {
    return null;
  }

  return (
    <Link href="/account/multisigs">
      <SecondaryButton
        size="small"
        iconLeft={<MenuMultisig className="w-4 h-4 text-textTertiary" />}
        iconRight={<ArrowRight className="w-4 h-4 text-textTertiary" />}
      >
        Multisig
      </SecondaryButton>
    </Link>
  );
}

export default function AccountPanelQuickAccess() {
  const router = useRouter();

  if (router.pathname.startsWith("/account")) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 ml-[52px]">
      <ProxyButton />
      <MultisigButton />
    </div>
  );
}
