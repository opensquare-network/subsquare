import clsx from "clsx";
import { useChainSettings } from "next-common/context/chain";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { useToggle } from "usehooks-ts";
import NavMenu from "./menu";
import ArrowFoldIcon from "next-common/assets/imgs/icons/arrow-fold.svg";
import MenuIcon from "next-common/assets/imgs/icons/menu.svg";
import CloseIcon from "next-common/assets/imgs/icons/close.svg";
import tw from "tailwind-styled-components";
import HeaderDrawer from "../header/v2/drawer";
import { useIsDark } from "next-common/context/theme";

export default function Nav() {
  const { sm } = useScreenSize();

  return sm ? <NavMobile /> : <NavDesktop />;
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
    <div className="text12Medium mt-1 max-sm:mt-0 text-textTertiaryContrast">
      Governance by Subsquare
    </div>
  );
}

function NavLogo({ className = "" }) {
  const chainSettings = useChainSettings();
  const isDark = useIsDark();
  const navLogo = isDark ? chainSettings.navLogoDark : chainSettings.navLogo;

  if (!navLogo) {
    return null;
  }

  return <div className={className}>{navLogo}</div>;
}

const ToggleMenuButton = tw.button`
w-6 h-6 bg-navigationActive rounded
`;

function NavDesktop() {
  const [menuCollapsed, menuToggle] = useToggle(false);

  return (
    <nav
      className={clsx(
        menuCollapsed ? "w-[72px]" : "w-[300px]",
        "max-w-[300px] h-full overflow-y-scroll",
        "bg-navigationBg dark:bg-neutral100 text-navigationText",
      )}
    >
      <div>
        <NavLogo className="p-4" />
        <div className="py-4 px-6 flex justify-between h-[84px]">
          <div className={clsx(menuCollapsed && "hidden")}>
            <ChainName />
            <BrandingHint />
          </div>
          <div>
            <ToggleMenuButton onClick={menuToggle}>
              <ArrowFoldIcon className={clsx(menuCollapsed && "rotate-180")} />
            </ToggleMenuButton>
          </div>
        </div>
      </div>

      <div className="p-4">
        <NavMenu collapsed={menuCollapsed} />
      </div>
    </nav>
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

  return (
    <nav
      className={clsx("bg-navigationBg dark:bg-neutral100 text-navigationText")}
    >
      <div className={clsx("h-16", "flex items-center justify-between")}>
        <NavMobileToolbarItem>
          <ToggleMenuButton onClick={menuToggle}>
            <ArrowFoldIcon className={clsx(!menuVisible && "rotate-180")} />
          </ToggleMenuButton>
        </NavMobileToolbarItem>
        <div className="text-center">
          <ChainName />
          <BrandingHint />
        </div>
        <NavMobileToolbarItem>
          <div role="button" onClick={toolbarToggle}>
            <MenuIcon
              className={clsx(
                "[&_path]:stroke-textPrimaryContrast",
                toolbarVisible && "hidden",
              )}
            />
            <CloseIcon
              className={clsx(
                "[&_path]:stroke-textPrimaryContrast",
                !toolbarVisible && "hidden",
              )}
            />
          </div>
        </NavMobileToolbarItem>
      </div>

      <NavMobileFloatContainer
        className={clsx("bg-navigationBg", menuVisible ? "block" : "hidden")}
      >
        <NavMenu />
      </NavMobileFloatContainer>

      <NavMobileFloatContainer
        className={clsx("bg-neutral100", toolbarVisible ? "block" : "hidden")}
      >
        <HeaderDrawer />
      </NavMobileFloatContainer>
    </nav>
  );
}
