import { createContext, useContext } from "react";

const PayoutQueueSourceContext = createContext(false);

export function PayoutQueueSourceProvider({ children }) {
  return (
    <PayoutQueueSourceContext.Provider value={true}>
      {children}
    </PayoutQueueSourceContext.Provider>
  );
}

export function usePayoutQueueIsDemo() {
  return useContext(PayoutQueueSourceContext);
}
