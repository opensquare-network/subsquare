import { createContext, useContext } from "react";
import useRegistrarsList from "next-common/utils/hooks/useRegistrarsList";

const RegistrarContext = createContext(null);

export default function RegistrarProvider({ children }) {
  const { registrars, isLoading } = useRegistrarsList();

  return (
    <RegistrarContext.Provider value={{ registrars, isLoading }}>
      {children}
    </RegistrarContext.Provider>
  );
}

export function useRegistrarContext() {
  return useContext(RegistrarContext);
}
