import React, { useContext } from "react";

const PopupContext = React.createContext();

export default PopupContext;

export function PopupContextProvider({ children, params }) {
  return (
    <PopupContext.Provider value={{ params }}>{children}</PopupContext.Provider>
  );
}

export function usePopupParams() {
  const context = useContext(PopupContext);
  return context?.params || {};
}
