import { createStateContext } from "react-use";

const [useSharedCoretimeSale, Provider] = createStateContext({});

export function CoretimeSaleProvider({ value, children }) {
  return (
    <Provider initialValue={value}>
      {children}
    </Provider>
  );
}

export default function useCoretimeSale() {
  const [sale] = useSharedCoretimeSale();
  return sale;
}
