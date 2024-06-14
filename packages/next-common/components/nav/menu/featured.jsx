import { useNavSubmenuVisible } from "next-common/context/nav";
import NavMenuGroup from "./group";
import NavMenuItem from "./item";
import { useRouter } from "next/router";

export default function NavFeaturedMenu({ collapsed, menu = [] }) {
  const [navSubmenuVisible, setNavSubmenuVisible] = useNavSubmenuVisible();

  const router = useRouter();

  return (
    <ul>
      {menu?.map((item) => (
        <li key={item.name}>
          {item.name &&
            (item.items ? (
              <NavMenuGroup
                menu={item}
                collapsed={collapsed}
                navSubmenuVisible={navSubmenuVisible}
                setNavSubmenuVisible={setNavSubmenuVisible}
              />
            ) : (
              <NavMenuItem
                item={item}
                active={router.asPath === item.pathname}
                collapsed={collapsed}
              />
            ))}
        </li>
      ))}
    </ul>
  );
}
