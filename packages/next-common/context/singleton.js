import React from "react";

export function createSingletonContextProvider(useValue) {
  const Context = React.createContext();

  const Provider = ({ children }) => {
    const value = useValue();
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const SingletonProvider = ({ children }) => {
    const parent = React.useContext(Context);
    if (parent !== undefined) {
      return <>{children}</>;
    }
    return <Provider>{children}</Provider>;
  };

  return {
    Context,
    Provider: SingletonProvider,
  };
}
