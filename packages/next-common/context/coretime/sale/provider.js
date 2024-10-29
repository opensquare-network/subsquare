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

export function useCoretimeSaleStart() {
  const sale = useCoretimeSale();
  const { info: { saleStart } = {} } = sale;

  return saleStart;
}

export function useCoretimeSaleInitHeight() {
  const sale = useCoretimeSale();
  const { initIndexer = {} } = sale;

  return initIndexer?.blockHeight;
}
