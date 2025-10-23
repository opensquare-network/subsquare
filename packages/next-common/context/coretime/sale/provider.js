import useIsCoretimeUseRCBlockNumber from "next-common/hooks/coretime/useIsCoretimeUseRCBlockNumber";
import { createStateContext } from "react-use";

const [useSharedCoretimeSale, Provider] = createStateContext({});

export function CoretimeSaleProvider({ value, children }) {
  return <Provider initialValue={value}>{children}</Provider>;
}

export default function useCoretimeSale() {
  const [sale] = useSharedCoretimeSale();
  return sale;
}

export function useCoretimeSaleInitIndexer() {
  const sale = useCoretimeSale();
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(sale?.id);
  const { relayIndexer = {}, initIndexer = {} } = sale || {};

  return isUseRCBlockNumber ? relayIndexer : initIndexer;
}

export function useCoretimeSaleInitHeight() {
  const initIndexer = useCoretimeSaleInitIndexer();
  return initIndexer?.blockHeight;
}

export function useCoretimeSaleRelayIndexerHeight() {
  const sale = useCoretimeSale();
  return sale?.relayIndexer?.blockHeight;
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
