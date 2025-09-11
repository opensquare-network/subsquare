import { useAsync } from "react-use";
import queryTokenPrices from "./query/queryTokenPrices";
import { createStateContext } from "react-use";
import { useEffect, useMemo, useState } from "react";

const [useCfgTokenPrices, InnerProvider] = createStateContext({});

export const TIME_RANGE = {
  DAY_1: "DAY_1",
  DAY_7: "DAY_7",
  DAY_30: "DAY_30",
  DAY_90: "DAY_90",
  DAY_365: "DAY_365",
  DAY_ALL: "DAY_ALL",
};

function parsePricesDataType(price) {
  return {
    price: parseFloat(price.price),
    time: parseFloat(price.time),
  };
}

function DataUpdater({ children }) {
  const [range, setRange] = useState(TIME_RANGE.DAY_7);
  const { value, loading } = useAsync(() => queryTokenPrices(range), [range]);
  const data = useMemo(() => (value || []).map(parsePricesDataType), [value]);
  const [, setCfgTokenPrices] = useCfgTokenPrices();

  useEffect(() => {
    setCfgTokenPrices({ data, loading, range, setRange });
  }, [data, loading, setCfgTokenPrices, range, setRange]);

  return children;
}

export function TokenPricesProvider({ children }) {
  return (
    <InnerProvider>
      <DataUpdater>
        {children}
      </DataUpdater>
    </InnerProvider>
  );
}

export default useCfgTokenPrices;
