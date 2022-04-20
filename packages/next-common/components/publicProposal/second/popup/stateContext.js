import React, { createContext, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [signerBalance, setSignerBalance] = useState(0);
  const [signerAccount, setSignerAccount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <StateContext.Provider
      value={{
        signerBalance,
        setSignerBalance,
        signerAccount,
        setSignerAccount,
        isSubmitting,
        setIsSubmitting,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
