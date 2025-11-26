import { cn } from "next-common/utils";
import { startCase, capitalize, sumBy } from "lodash-es";
import { useRouter } from "next/router";
import { ArrowRight } from "@osn/icons/subsquare";
import * as HoverCard from "@radix-ui/react-hover-card";
import NavMenuDivider from "../../divider";
import { isChildActive } from "./group";
import Link from "next/link";
import NavMenuItemTemplate, {
  NavMenuItemTemplateContent,
} from "./itemTemplate";

function HoverSubMenuLeaf({ menu }) {
  const router = useRouter();
  const routePathname = router.asPath.split("?")[0];
  return (
    <li>
      <Link
        className="pl-2 w-full h-10 flex px-2 py-2.5 items-center rounded-lg cursor-pointer text14Medium"
        href={menu.pathname}
        target={menu.isExternal ? "_blank" : "_self"}
      >
        <div className="w-1 h-1 rounded-full bg-textSecondary" />
        <NavMenuItemTemplate
          name={startCase(capitalize(menu.name))}
          activeCount={
            sumBy(
              (menu?.items || []).filter((item) => !item.excludeToSumActives),
              "activeCount",
            ) ?? menu.activeCount
          }
          className="bg-transparent"
          active={
            menu.pathname === routePathname ||
            menu?.extraMatchNavMenuActivePathnames?.includes?.(router.pathname)
          }
        />
      </Link>
    </li>
  );
}

function HoverSubMenuGroup({ menu }) {
  const router = useRouter();
  const firstPath = "/" + router.asPath.split("/").filter(Boolean)[0];

  return (
    <HoverCard.Root openDelay={0} closeDelay={0}>
      <HoverCard.Trigger asChild>
        <li className="pl-2 w-full h-10 flex px-2 py-2.5 items-center rounded-lg cursor-pointer text14Medium">
          <div className="w-1 h-1 rounded-full bg-textSecondary" />
          <NavMenuItemTemplate
            name={startCase(capitalize(menu.name))}
            activeCount={
              sumBy(
                (menu?.items || []).filter((item) => !item.excludeToSumActives),
                "activeCount",
              ) ?? menu.activeCount
            }
            className="bg-transparent pr-0"
            extra={
              <span>
                <ArrowRight
                  className={cn("[&_path]:stroke-navigationTextTertiary")}
                />
              </span>
            }
            active={
              firstPath === menu.pathname ||
              menu.extraMatchNavMenuActivePathnames?.includes?.(
                router.pathname,
              ) ||
              isChildActive(menu?.items, router.pathname)
            }
            hoverTooltipLabel={false}
          />
        </li>
      </HoverCard.Trigger>

      <HoverCard.Content side="right" align="start" alignOffset={-8}>
        <HoverMenuItem menu={menu} />
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

function HoverSubMenuItem({ menu }) {
  if (menu.type === "divider") {
    return <NavMenuDivider />;
  }

  if (!menu?.items?.length || menu?.hideItemsOnMenu) {
    return <HoverSubMenuLeaf menu={menu} />;
  }

  return <HoverSubMenuGroup menu={menu} />;
}

export default function HoverMenuItem({ menu }) {
  return (
    <div className="pl-6">
      <div className="py-2.5 px-4 bg-navigationBg w-[268px] rounded-lg max-h-screen overflow-y-scroll scrollbar-pretty border border-navigationBorder">
        <div className="w-full h-10 flex px-2 py-2.5 gap-x-4 items-center rounded-lg cursor-pointer text14Medium pointer-events-none">
          <NavMenuItemTemplateContent
            name={startCase(capitalize(menu.name))}
            activeCount={sumBy(menu?.items, "activeCount") ?? menu.activeCount}
          />
        </div>
        <NavMenuDivider />
        <ul>
          {menu.items?.map((item, idx) => (
            <HoverSubMenuItem menu={item} key={idx} />
          ))}
        </ul>
      </div>
    </div>
  );
}
