import { useAsync } from "react-use";
import queryDailyExtrinsics from "./query/queryDailyExtrinsics";

const { createContext, useContext, useMemo } = require("react");

const DailyExtrinsicsContext = createContext(null);

export default DailyExtrinsicsContext;

export function DailyExtrinsicsProvider({ children }) {
  const { value, loading } = useAsync(() => queryDailyExtrinsics(), []);
  const sortedData = useMemo(
    () => value?.sort((a, b) => a.startTime - b.startTime),
    [value],
  );

  return (
    <DailyExtrinsicsContext.Provider value={{ data: sortedData, loading }}>
      {children}
    </DailyExtrinsicsContext.Provider>
  );
}

export function useDailyExtrinsics() {
  return useContext(DailyExtrinsicsContext);
}
