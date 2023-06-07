import clsx from "clsx";
import { useChainSettings } from "next-common/context/chain";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { useToggle } from "usehooks-ts";
import NavMenu from "./menu";

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

function NavDesktop() {
  const [collapsed, toggle] = useToggle(false);

  return (
    <nav
      className={clsx(
        collapsed ? "w-[72px]" : "w-[300px]",
        "max-w-[300px] h-full",
        "bg-navigationBg dark:bg-neutral100 text-navigationText",
      )}
    >
      <div>
        <div className="p-4">logo</div>
        <div className="py-4 px-6 flex justify-between">
          <div className={clsx(collapsed && "hidden")}>
            <ChainName />
            <BrandingHint />
          </div>
          <div>
            <button
              className="w-6 h-6 bg-navigationActive rounded"
              onClick={toggle}
            >
              {"<>"}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <NavMenu />
      </div>
    </nav>
  );
}

function NavMobileToolbarItem({ children }) {
  return (
    <div className="w-[72px] flex items-center justify-center">{children}</div>
  );
}
function NavMobile() {
  return (
    <nav
      className={clsx(
        "h-16",
        "flex items-center justify-between",
        "bg-navigationBg dark:bg-neutral100 text-navigationText",
      )}
    >
      <NavMobileToolbarItem>
        <button>{"<>"}</button>
      </NavMobileToolbarItem>
      <div className="text-center">
        <ChainName />
        <BrandingHint />
      </div>
      <NavMobileToolbarItem>
        <div>--</div>
      </NavMobileToolbarItem>
    </nav>
  );
}
