import React, { createContext, useContext } from "react";
import {
  detailPageCategory,
  listPageCategory,
} from "../../utils/consts/business/category";

const PageContext = createContext({});

export default function PageProvider({ pageProperties = {}, children }) {
  return (
    <PageContext.Provider value={pageProperties}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageProperties() {
  return useContext(PageContext);
}

/**
 * @returns {listPageCategory[keyof typeof listPageCategory]}>
 */
export function useListPageType() {
  let { listPageType } = usePageProperties();

  // treat page `/fellowship` as `fellowship/referenda`
  if (listPageType === "fellowship") {
    listPageType = listPageCategory.FELLOWSHIP_REFERENDA;
  }

  if (!Object.values(listPageCategory).includes(listPageType)) {
    throw new Error(`Unknown list page type: ${listPageType}`);
  }

  return listPageType;
}

export function useDetailType() {
  const { type } = usePageProperties();
  if (!Object.values(detailPageCategory).includes(type)) {
    throw new Error(`Unknown detail page type: ${type}`);
  }
  return type;
}

/**
 * @description props from `getServerSideProps`
 */
export function usePageProps() {
  const { props } = usePageProperties();
  return props || {};
}

/**
 * @returns {string}
 */
export function useUserAgent() {
  const { userAgent } = usePageProperties();
  return userAgent ?? "";
}

export function useIsMacOS() {
  const userAgent = useUserAgent();
  return userAgent.includes("Mac OS");
}
