import React, { createContext, useContext, useReducer } from "react";
import { emptyFunction } from "../../utils";
import { setCookie } from "../../utils/viewfuncs/cookies";
import { CACHE_KEY } from "../../utils/constants";

export const EXPANDED_MENUS_UPDATE_ACTION = "UPDATE";

const HomeExpandedMenusContext = createContext(null);
const SettingsDispatchContext = createContext(emptyFunction);

export default function SettingsProvider({ homeExpandedMenus = "", children }) {
  let expandedMenus = {};
  try {
    expandedMenus = JSON.parse(decodeURIComponent(homeExpandedMenus));
  } catch (_) {
    /* empty */
  }

  const [initialItems, dispatch] = useReducer(
    expandedMenusReducer,
    expandedMenus,
  );

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

function expandedMenusReducer(expandedMenus = {}, action) {
  if (action.type === EXPANDED_MENUS_UPDATE_ACTION) {
    const { menu, expanded } = action.payload;

    const result = {
      ...expandedMenus,
      [menu]: expanded,
    };

    setCookie(CACHE_KEY.homeExpandedMenus, JSON.stringify(result));

    return result;
  }

  throw new Error(`Unknown expand menus action: ${action.type}`);
}

export function updateHomeExpandedMenus(menu, expanded = true, dispatch) {
  dispatch({
    type: EXPANDED_MENUS_UPDATE_ACTION,
    payload: {
      menu,
      expanded,
    },
  });
}
