import { useAsync } from "react-use";
import queryBasicData from "./query/queryBasicData";
import { createStateContext } from 'react-use';
import { useEffect } from "react";

const [useCfgBasicData, CfgBasicDataProvider] = createStateContext({});

function DataUpdater({ children }) {
  const { value, loading } = useAsync(() => queryBasicData(), []);
  const [, setCfgBasicData] = useCfgBasicData();

  useEffect(() => {
    setCfgBasicData({ data: value, loading });
  }, [value, loading]);

  return children;
}

export function BasicDataProvider({ children }) {
  return (
    <CfgBasicDataProvider>
      <DataUpdater>
        {children}
      </DataUpdater>
    </CfgBasicDataProvider>
  );
}

export default useCfgBasicData;
