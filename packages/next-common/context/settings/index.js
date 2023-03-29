import React, { createContext, useContext, useReducer } from "react";
import { emptyFunction } from "../../utils";
import { setCookie } from "../../utils/viewfuncs/cookies";
import { CACHE_KEY } from "../../utils/constants";
import { allHomeMenuNames } from "../../utils/consts/menu";

export const EXPANDED_MENUS_UPDATE_ACTION = "UPDATE";

const HomeExpandedMenusContext = createContext(null);
const SettingsDispatchContext = createContext(emptyFunction);

export default function SettingsProvider({ homeExpandedMenus = "", children }) {
  let items;
  try {
    items = homeExpandedMenus
      .split("|")
      .map(decodeURIComponent)
      .filter((item) => allHomeMenuNames.includes(item));
  } catch (e) {
    items = [];
  }

  const [initialItems, dispatch] = useReducer(expandedMenusReducer, items);

  return (
    <HomeExpandedMenusContext.Provider value={initialItems}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </HomeExpandedMenusContext.Provider>
  );
}

export function useHomeExpandedMenus() {
  return useContext(HomeExpandedMenusContext);
}

export function useSettingsDispatch() {
  return useContext(SettingsDispatchContext);
}

function expandedMenusReducer(items = [], action) {
  if (action.type === EXPANDED_MENUS_UPDATE_ACTION) {
    const { item, expanded } = action.payload;
    let result;
    if (expanded) {
      result = [...items, item];
    } else {
      result = items.filter((i) => i !== item);
    }
    setCookie(CACHE_KEY.homeExpandedMenus, result.join("|"));

    return result;
  }

  throw new Error(`Unknown expand menus action: ${action.type}`);
}

export function updateHomeExpandedMenus(item, expanded = true, dispatch) {
  dispatch({
    type: EXPANDED_MENUS_UPDATE_ACTION,
    payload: {
      item,
      expanded,
    },
  });
}
