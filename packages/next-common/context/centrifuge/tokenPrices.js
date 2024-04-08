import { useAsync } from "react-use";
import queryTokenPrices from "./query/queryTokenPrices";

const { createContext, useContext, useState, useMemo } = require("react");

const TokenPricesContext = createContext(null);

export default TokenPricesContext;

export const TIME_RANGE = {
  DAY_1: "DAY_1",
  DAY_7: "DAY_7",
  DAY_30: "DAY_30",
  DAY_90: "DAY_90",
  DAY_365: "DAY_365",
};

function parsePricesDataType(price) {
  return {
    price: parseFloat(price.price),
    time: parseFloat(price.time),
  };
}

export function TokenPricesProvider({ children }) {
  const [range, setRange] = useState(TIME_RANGE.DAY_7);
  const { value, loading } = useAsync(() => queryTokenPrices(range), [range]);
  const data = useMemo(() => (value || []).map(parsePricesDataType), [value]);

  return (
    <TokenPricesContext.Provider value={{ range, setRange, data, loading }}>
      {children}
    </TokenPricesContext.Provider>
  );
}

export function useTokenPrices() {
  return useContext(TokenPricesContext);
}
