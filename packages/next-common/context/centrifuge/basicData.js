import { useAsync } from "react-use";
import queryBasicData from "./query/queryBasicData";

const { createContext, useContext } = require("react");

const BasicDataContext = createContext(null);

export default BasicDataContext;

export function BasicDataProvider({ children }) {
  const { value, loading } = useAsync(() => queryBasicData(), []);
  return (
    <BasicDataContext.Provider value={{ data: value, loading }}>
      {children}
    </BasicDataContext.Provider>
  );
}

export function useBasicData() {
  return useContext(BasicDataContext);
}
