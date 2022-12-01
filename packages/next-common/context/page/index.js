import { createContext, useContext } from "react";
import { detailPageCategory } from "../../utils/consts/business/category";

const PageContext = createContext({});

export default function PageProvider({ pageProperties = {}, children }) {
  return (
    <PageContext.Provider value={pageProperties}>
      {children}
    </PageContext.Provider>
  );
}

function usePageProperties() {
  return useContext(PageContext);
}

export function useDetailType() {
  const { type } = usePageProperties();
  if (!Object.values(detailPageCategory).includes(type)) {
    throw new Error(`Unknown detail page type: ${type}`);
  }
  return type;
}
