import { cn } from "next-common/utils";
import { ArrowFold } from "@osn/icons/subsquare";
import Link from "next/link";
import { useNavCollapsed } from "next-common/context/nav";
import { BrandingHint, SiteName, ToggleMenuButton } from "./styled";

export default function NavDesktopLayout({ logo, name, hint, menu }) {
  const [navCollapsed, setNavCollapsed] = useNavCollapsed();

  return (
    <nav
      className={cn(
        navCollapsed ? "w-[72px]" : "w-[300px]",
        "border-r border-neutral300",
        "max-w-[300px] max-sm:hidden h-full overflow-y-scroll",
        "bg-navigationBg dark:bg-neutral100 text-navigationText",
        "scrollbar-hidden",
      )}
    >
      <div>
        {logo}
        <div className="py-4 px-6 flex justify-between h-[84px]">
          <Link href="/">
            <div className={cn(navCollapsed && "hidden")}>
              <SiteName>{name}</SiteName>
              <BrandingHint>{hint}</BrandingHint>
            </div>
          </Link>
          <div>
            <ToggleMenuButton onClick={() => setNavCollapsed(!navCollapsed)}>
              <ArrowFold className={cn(navCollapsed && "rotate-180")} />
            </ToggleMenuButton>
          </div>
        </div>
      </div>

      <div className="p-4">{menu}</div>
    </nav>
  );
}
