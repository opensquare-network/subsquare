import { sortAddresses } from "@polkadot/util-crypto";
import { isNil } from "lodash-es";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import WindowSizeProvider from "next-common/context/windowSize";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";
import DelegatesDesktopList from "./desktopList";
import DelegatesMobileList from "./mobileList";

function DelegatesImpl() {
  const isMobile = useIsMobile();
  const { cohort } = usePageProps();
  const { ss58Format } = useChainSettings();

  if (isNil(cohort)) return null;

  const delegates = sortAddresses(
    cohort.delegates?.map((delegate) => delegate.address) || [],
    ss58Format,
  );

  if (isMobile) {
    return <DelegatesMobileList delegates={delegates} />;
  }

  return <DelegatesDesktopList delegates={delegates} />;
}

export default function Delegates() {
  return (
    <WindowSizeProvider>
      <DelegatesImpl />
    </WindowSizeProvider>
  );
}
