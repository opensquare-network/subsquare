import { useMemo } from "react";
import { useSelector } from "react-redux";
import { hasGov2Selector } from "../../store/reducers/chainSlice";
import homeMenusOrigin from "../consts/menu";
import { gov2Entry } from "../consts/menu/gov2";

export function useHomeMenus() {
  const hasGov2 = useSelector(hasGov2Selector);

  const menu = useMemo(() => {
    // copy
    const homeMenus = Array.from(homeMenusOrigin);

    if (hasGov2) {
      homeMenus.splice(1, 0, { items: [gov2Entry] });
    }

    return homeMenus;
  }, [hasGov2]);

  return menu;
}
