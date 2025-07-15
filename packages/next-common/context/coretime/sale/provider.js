import { createStateContext } from "react-use";

const [useSharedCoretimeSale, Provider] = createStateContext({});

export function CoretimeSaleProvider({ value, children }) {
  return <Provider initialValue={value}>{children}</Provider>;
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

export function useCoretimeSaleInfo() {
  const sale = useCoretimeSale();
  const { info = {} } = sale;

  if (!info) {
    throw new Error("Coretime sale info should be available");
  }

  return info;
}

export function useCoretimeSaleConfiguration() {
  const sale = useCoretimeSale();
  const { configuration } = sale;

  if (!configuration) {
    throw new Error("Coretime sale configuration should be available");
  }

  return configuration;
}

export { useSharedCoretimeSale };
