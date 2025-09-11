import React, { createContext, useContext } from "react";
import { isNil, noop } from "lodash-es";

const CommonPopupContext = createContext(null);

export default function CommonPopupProvider({ children, onClose }) {
  return (
    <CommonPopupContext.Provider value={{ onClose }}>
      {children}
    </CommonPopupContext.Provider>
  );
}

export function usePopupOnClose() {
  const value = useContext(CommonPopupContext);
  if (isNil(value)) {
    return noop;
  }

  return value.onClose;
}
