import { cn } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { useToggle } from "usehooks-ts";
import NavMenu from "./menu";
import tw from "tailwind-styled-components";
import HeaderDrawer from "../header/drawer";
import { ArrowFold, SystemClose, SystemMenu } from "@osn/icons/subsquare";
import Link from "next/link";
import { useNavCollapsed } from "next-common/context/nav";
import { useScrollLock } from "next-common/utils/hooks/useScrollLock";
import { useEffect } from "react";
import ChainLogo from "./logo";
import NavDesktopLayout from "./navDesktopLayout";
import { ToggleMenuButton } from "./styled";

export default function Nav() {
  return (
    <>
      <NavDesktop />
      <NavMobile />
    </>
  );
}

function ChainName() {
  const chainSettings = useChainSettings();

  return (
    <h2 className="text20BoldLogo max-sm:text-[20px] max-sm:font-[28px]">
      {chainSettings.name}
    </h2>
  );
}

function BrandingHint() {
  return (
    <div className="text12Medium mt-1 max-sm:mt-0 text-navigationTextTertiary">
      Governance by Subsquare
    </div>
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

const NavMobileToolbarItem = tw.div`
w-[72px] flex items-center justify-center
`;
const NavMobileFloatContainer = tw.div`
fixed bottom-0 top-16 left-0 right-0
p-4 overflow-y-scroll
`;
function NavMobile() {
  const [menuVisible, menuToggle] = useToggle(false);
  const [toolbarVisible, toolbarToggle] = useToggle(false);
  const [, setLocked] = useScrollLock();

  useEffect(() => {
    if (menuVisible || toolbarVisible) {
      setLocked(true);
    } else {
      setLocked(false);
    }
  }, [menuVisible, toolbarVisible]);

  return (
    <nav
      className={cn(
        "border-b border-neutral300 bg-navigationBg dark:bg-neutral100 text-navigationText",
        "sm:hidden",
      )}
    >
      <div className={cn("h-16", "flex items-center justify-between")}>
        <NavMobileToolbarItem>
          <ToggleMenuButton onClick={menuToggle}>
            <ArrowFold className={cn(!menuVisible && "rotate-180")} />
          </ToggleMenuButton>
        </NavMobileToolbarItem>
        <Link href="/">
          <div className="text-center">
            <ChainName />
            <BrandingHint />
          </div>
        </Link>
        <NavMobileToolbarItem>
          <div role="button" onClick={toolbarToggle}>
            <SystemMenu
              className={cn(
                "[&_path]:fill-navigationText",
                toolbarVisible && "hidden",
              )}
            />
            <SystemClose
              className={cn(
                "[&_path]:fill-navigationText",
                !toolbarVisible && "hidden",
              )}
            />
          </div>
        </NavMobileToolbarItem>
      </div>

      {menuVisible && (
        <NavMobileFloatContainer className={cn("bg-navigationBg")}>
          <NavMenu />
        </NavMobileFloatContainer>
      )}

      {toolbarVisible && (
        <NavMobileFloatContainer className={cn("bg-neutral100")}>
          <HeaderDrawer />
        </NavMobileFloatContainer>
      )}
    </nav>
  );
}
