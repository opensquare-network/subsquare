import { useChainSettings } from "next-common/context/chain";
import NavMenu from "./menu";
import HeaderDrawer from "../header/drawer";
import { useNavCollapsed } from "next-common/context/nav";
import ChainLogo from "./logo";
import NavDesktopLayout from "./navDesktopLayout";
import NavMobileLayout from "./navMobileLayout";

export default function Nav() {
  return (
    <>
      <NavDesktop />
      <NavMobile />
    </>
  );
}

function NavDesktop() {
  const [navCollapsed] = useNavCollapsed();
  const chainSettings = useChainSettings();

  return (
    <NavDesktopLayout
      logo={<ChainLogo className="p-4 flex" />}
      menu={<NavMenu collapsed={navCollapsed} />}
      name={chainSettings.name}
      hint="Governance by Subsquare"
    />
  );
}

function NavMobile() {
  const chainSettings = useChainSettings();

  return (
    <NavMobileLayout
      header={<HeaderDrawer />}
      menu={<NavMenu />}
      name={chainSettings.name}
      hint="Governance by Subsquare"
    />
  );
}
