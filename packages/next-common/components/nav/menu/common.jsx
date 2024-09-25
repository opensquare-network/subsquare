import { usePageProps } from "next-common/context/page";
import { getCommonMenu } from "next-common/utils/consts/menu";
import NavMenuItem from "./item";
import { useRouter } from "next/router";

export default function NavCommonMenu({ collapsed }) {
  const router = useRouter();
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
    </ul>
  );
}
