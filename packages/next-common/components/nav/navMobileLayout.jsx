import { cn } from "next-common/utils";
import { useToggle } from "usehooks-ts";
import tw from "tailwind-styled-components";
import { ArrowFold, SystemClose, SystemMenu } from "@osn/icons/subsquare";
import Link from "next/link";
import { useScrollLock } from "next-common/utils/hooks/useScrollLock";
import { useEffect } from "react";
import { BrandingHint, SiteName, ToggleMenuButton } from "./styled";

const NavMobileToolbarItem = tw.div`
  w-[72px] flex items-center justify-center
`;

const NavMobileFloatContainer = tw.div`
  fixed bottom-0 top-16 left-0 right-0
  p-4 overflow-y-scroll
`;

export default function NavMobileLayout({ header, name, hint, menu }) {
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
            <SiteName>{name}</SiteName>
            <BrandingHint>{hint}</BrandingHint>
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
          {menu}
        </NavMobileFloatContainer>
      )}

      {toolbarVisible && (
        <NavMobileFloatContainer className={cn("bg-neutral100")}>
          {header}
        </NavMobileFloatContainer>
      )}
    </nav>
  );
}
