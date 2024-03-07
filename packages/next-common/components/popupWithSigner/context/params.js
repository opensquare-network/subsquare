import React, { useContext } from "react";

const PopupParamsContext = React.createContext();

export default PopupParamsContext;

export function PopupParamsProvider({ children, ...props }) {
  return (
    <PopupParamsContext.Provider value={props}>
      {children}
    </PopupParamsContext.Provider>
  );
}

export function usePopupParams() {
  const context = useContext(PopupParamsContext);
  return context || {};
}
