import { createContext, useContext, useState } from "react";

const CallPopupContext = createContext();

export function CallPopupProvider({ children }) {
  const [showPopup, setShowPopup] = useState(false);
  // { call, callHex, blockHeight }
  const [callPopupData, setCallPopupData] = useState(null);

  return (
    <CallPopupContext.Provider
      value={{
        showPopup,
        setShowPopup,
        callPopupData,
        setCallPopupData,
      }}
    >
      {children}
    </CallPopupContext.Provider>
  );
}

export function useCallPopup() {
  return useContext(CallPopupContext);
}
