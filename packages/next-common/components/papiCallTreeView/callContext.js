import React from "react";

const CallContext = React.createContext();

export default CallContext;

export function CallContextProvider({ children, value }) {
  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export function useCallContext() {
  return React.useContext(CallContext);
}
