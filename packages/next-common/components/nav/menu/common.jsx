import { useIsMacOS, usePageProps } from "next-common/context/page";
import { getCommonMenu } from "next-common/utils/consts/menu";
import NavMenuItem from "./item";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCmdkPaletteVisible } from "next-common/store/reducers/cmdkSlice";
import { MenuNavigation } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function NavCommonMenu({ collapsed }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMacOS = useIsMacOS();
  const { tracks, fellowshipTracks, ambassadorTracks } = usePageProps();
  const commonMenu = getCommonMenu({
    tracks,
    fellowshipTracks,
    ambassadorTracks,
  });
  const routePathname = router.asPath.split("?")[0];

  return (
    <ul>
      {commonMenu?.map?.((item) => (
        <li key={item.value}>
          <NavMenuItem
            item={item}
            active={
              item.pathname === routePathname ||
              item?.extraMatchNavMenuActivePathnames?.includes?.(
                router.pathname,
              )
            }
            collapsed={collapsed}
            hoverTooltip
          />
        </li>
      ))}
      <li>
        <NavMenuItem
          item={{
            name: "Navigation",
            icon: <MenuNavigation />,
          }}
          onClick={() => {
            dispatch(setCmdkPaletteVisible(true));
          }}
          collapsed={collapsed}
          extra={
            <span
              className={cn(
                "bg-navigationActive rounded py-0.5 px-2",
                "text12Medium text-navigationTextTertiary",
              )}
            >
              {isMacOS ? "⌘" : "Ctrl +"} K
            </span>
          }
          hoverTooltip
        />
      </li>
    </ul>
  );
}
