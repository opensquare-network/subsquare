import React, { createContext, useState } from "react";

export const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const [signerBalance, setSignerBalance] = useState(0);
  const [signerAccount, setSignerAccount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <StatusContext.Provider
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
    </StatusContext.Provider>
  );
};
