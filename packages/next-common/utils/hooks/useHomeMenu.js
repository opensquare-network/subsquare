import { useMemo } from "react";
import homeMenusOrigin from "../consts/menu";
import { gov2EntryItem } from "../consts/menu/gov2";
import { useChainSettings } from "../../context/chain";

export function useHomeMenus() {
  const { hasGov2 } = useChainSettings();

  return useMemo(() => {
    // copy
    const homeMenus = Array.from(homeMenusOrigin);

    if (hasGov2) {
      homeMenus.splice(1, 0, { items: [gov2EntryItem] });
    }

    return homeMenus;
  }, [hasGov2]);
}
