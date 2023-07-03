import { useIsMacOS, usePageProps } from "next-common/context/page";
import { getCommonMenu } from "next-common/utils/consts/menu";
import NavMenuItem from "./item";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCmdkPaletteVisible } from "next-common/store/reducers/cmdkSlice";
import { MenuNavigation } from "@osn/icons/subsquare";
import clsx from "clsx";

export default function NavCommonMenu({ collapsed }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMacOS = useIsMacOS();
  const { tracks, fellowshipTracks } = usePageProps();
  const commonMenu = getCommonMenu({ tracks, fellowshipTracks });

  return (
    <ul>
      {commonMenu?.map?.((item) => (
        <li key={item.value}>
          <NavMenuItem
            icon={item.icon}
            label={item.name}
            link={item.pathname}
            active={item.pathname === router.asPath}
            collapsed={collapsed}
            hoverTooltip
          />
        </li>
      ))}
      <li>
        <NavMenuItem
          onClick={() => {
            dispatch(setCmdkPaletteVisible(true));
          }}
          icon={<MenuNavigation />}
          label="Navigation"
          collapsed={collapsed}
          extra={
            <span
              className={clsx(
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
