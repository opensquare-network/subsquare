import { createContext, useContext } from "react";
import useRegistrars from "next-common/hooks/people/useRegistrars";

const RegistrarContext = createContext(null);

export default function RegistrarProvider({ children }) {
  const { registrars, isLoading } = useRegistrars();

  return (
    <RegistrarContext.Provider value={{ registrars, isLoading }}>
      {children}
    </RegistrarContext.Provider>
  );
}

export function useRegistrarContext() {
  return useContext(RegistrarContext);
}
