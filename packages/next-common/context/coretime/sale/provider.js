import { createStateContext } from "react-use";

const [useCoretimeActiveSale, Provider] = createStateContext({});

export function CoretimeSaleProvider({ value, children }) {
  return (
    <Provider initialValue={value}>
      {children}
    </Provider>
  );
}

export default useCoretimeActiveSale;
