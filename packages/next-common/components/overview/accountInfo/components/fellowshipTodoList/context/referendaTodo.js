import { createContext, useContext } from "react";
import useReferendaTodo from "../hooks/useReferendaTodo";

export const ReferendaTodoContext = createContext();

export default function ReferendaTodoProvider({ children }) {
  const referendaTodoData = useReferendaTodo();
  return (
    <ReferendaTodoContext.Provider value={referendaTodoData}>
      {children}
    </ReferendaTodoContext.Provider>
  );
}

export function useReferendaTodoData() {
  return useContext(ReferendaTodoContext);
}
