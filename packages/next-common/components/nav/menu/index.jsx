import { ArrowCircleLeft } from "@osn/icons/subsquare";
import NavMenuItem from "./item";
import { useRouter } from "next/router";
import { useNavMenuType } from "next-common/context/nav";
import { NAV_MENU_TYPE } from "next-common/utils/constants";
import useMainMenuData from "next-common/hooks/useMainMenuData";

export default function NavMenu({ collapsed }) {
  const [navMenuType, setNavMenuType] = useNavMenuType();

  const router = useRouter();
  const mainMenu = useMainMenuData();

  let menu = [];
  if (navMenuType.type === NAV_MENU_TYPE.main) {
    menu = mainMenu;
  } else if (navMenuType.type === NAV_MENU_TYPE.subspace) {
    menu = [
      {
        name: "Back",
        icon: <ArrowCircleLeft />,
        onClick() {
          router.push("/");
        },
      },
      { type: "divider" },
      ...(navMenuType.menu || []),
    ];
  } else if (navMenuType.type === NAV_MENU_TYPE.archived) {
    menu = [
      {
        name: "Back",
        icon: <ArrowCircleLeft />,
        onClick() {
          setNavMenuType({ type: NAV_MENU_TYPE.main, menu: null });
        },
      },
      { type: "divider" },
      ...(navMenuType.menu || []),
    ];
  }

  return (
    <ul>
      <li>
        {menu.map((m, idx) => (
          <NavMenuItem
            key={`${m.value || ""}-${idx}`}
            {...m}
            collapsed={collapsed}
          />
        ))}
      </li>
    </ul>
  );
}
