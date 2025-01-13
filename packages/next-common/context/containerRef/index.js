import React from "react";

const ContainerRefContext = React.createContext(null);

export default ContainerRefContext;

export function ContainerRefProvider({ children, ref }) {
  return (
    <ContainerRefContext.Provider value={ref}>
      {children}
    </ContainerRefContext.Provider>
  );
}

export function useContainerRef() {
  return React.useContext(ContainerRefContext);
}
