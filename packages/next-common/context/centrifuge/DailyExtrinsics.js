import { useAsync } from "react-use";
import queryDailyExtrinsics from "./query/queryDailyExtrinsics";
import { createStateContext } from "react-use";
import { useEffect, useMemo } from "react";

const [useCfgDailyExtrinsic, InnerProvider] = createStateContext({});

function DataUpdater({ children }) {
  const { value, loading } = useAsync(() => queryDailyExtrinsics(), []);
  const sortedData = useMemo(() => value?.sort((a, b) => a.startTime - b.startTime), [value]);
  const [, setCfgDailyExtrinsic] = useCfgDailyExtrinsic();

  useEffect(() => {
    setCfgDailyExtrinsic({ data: sortedData, loading });
  }, [sortedData, loading, setCfgDailyExtrinsic]);

  return children;
}

export function DailyExtrinsicsProvider({ children }) {
  return (
    <InnerProvider>
      <DataUpdater>
        {children}
      </DataUpdater>
    </InnerProvider>
  );
}

export default useCfgDailyExtrinsic;
