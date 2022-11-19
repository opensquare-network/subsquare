import React, { createContext, useContext, useReducer } from "react";
import { emptyFunction } from "../../utils";
import { setCookie } from "../../utils/viewfuncs/cookies";
import { CACHE_KEY } from "../../utils/constants";
import { allHomeMenuNames } from "../../utils/consts/menu";

export const FOLD_ITEMS_UPDATE_ACTION = "UPDATE";

const HomeFoldItemsContext = createContext(null);
const SettingsDispatchContext = createContext(emptyFunction);

export default function SettingsProvider({ homeFoldItems = "", children }) {
  let items;
  try {
    items = homeFoldItems
      .split("|")
      .map(decodeURIComponent)
      .filter((item) => allHomeMenuNames.includes(item));
  } catch (e) {
    items = [];
  }

  const [initialItems, dispatch] = useReducer(foldItemsReducer, items);

  return (
    <HomeFoldItemsContext.Provider value={initialItems}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </HomeFoldItemsContext.Provider>
  );
}

export function useHomeFoldMenus() {
  return useContext(HomeFoldItemsContext);
}

export function useSettingsDispatch() {
  return useContext(SettingsDispatchContext);
}

function foldItemsReducer(items = [], action) {
  if (action.type === FOLD_ITEMS_UPDATE_ACTION) {
    const { item, isFold } = action.payload;
    let result;
    if (isFold) {
      result = [...items, item];
    } else {
      result = items.filter((i) => i !== item);
    }
    setCookie(CACHE_KEY.homeFoldedMenus, result.join("|"));

    return result;
  }

  throw new Error(`Unknown fold items action: ${action.type}`);
}

export function updateHomeFoldItems(item, isFold = true, dispatch) {
  dispatch({
    type: FOLD_ITEMS_UPDATE_ACTION,
    payload: {
      item,
      isFold,
    },
  });
}
