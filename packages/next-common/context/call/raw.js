import { createContext } from "react";

export const RawCallContext = createContext(null);

export default function RawCallProvider({ call, isLoading, children }) {
  return (
    <RawCallContext.Provider value={{ call, isLoading }}>
      {children}
    </RawCallContext.Provider>
  );
}
