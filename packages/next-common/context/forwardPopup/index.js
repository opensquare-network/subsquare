import React from "react";

const ForwardPopupContext = React.createContext(null);

export default function ForwardPopupProvider({ children }) {
  const [forwardPopup, setForwardPopup] = React.useState(null);

  if (forwardPopup) {
    return forwardPopup;
  }

  return (
    <ForwardPopupContext.Provider value={{ setForwardPopup }}>
      {children}
    </ForwardPopupContext.Provider>
  );
}

export function useForwardPopupContext() {
  return React.useContext(ForwardPopupContext);
}
