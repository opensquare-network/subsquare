import React, { useState, useContext } from "react";

const PopupContext = React.createContext();

export default function PopupComponentAndStateProvider({
  children,
  popup,
  params,
}) {
  const [isShow, setIsShow] = useState(false);
  const [popupParams, setPopupParams] = useState(params);

  return (
    <PopupContext.Provider value={{ popup, setPopupParams }}>
      {children}
      {isShow && <popup {...params} onClose={() => setIsShow(false)} />}
    </PopupContext.Provider>
  );
}

export function useOpenPopupFunc() {
  const {} = useContext(PopupContext);
}
