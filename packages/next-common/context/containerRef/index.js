import React from "react";

const ContainerRefContext = React.createContext(null);

export default ContainerRefContext;

export function ContainerRefProvider({ children, containerRef }) {
  return (
    <ContainerRefContext.Provider value={containerRef}>
      {children}
    </ContainerRefContext.Provider>
  );
}

export function useContainerRef() {
  return React.useContext(ContainerRefContext);
}
