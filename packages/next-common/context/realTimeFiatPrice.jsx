import { createContext, useContext } from "react";
import useFiatPrice from "next-common/hooks/useFiatPrice";

const RealTimeFiatPriceContext = createContext();

export default function RealTimeFiatPriceProvider({ children }) {
  const { price, loading } = useFiatPrice();
  return (
    <RealTimeFiatPriceContext.Provider value={{ price, loading }}>
      {children}
    </RealTimeFiatPriceContext.Provider>
  );
}

export function useRealTimeFiatPrice() {
  return useContext(RealTimeFiatPriceContext);
}
