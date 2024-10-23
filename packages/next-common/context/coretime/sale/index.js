import CoretimeActiveSaleSubscriber from "next-common/context/coretime/sale/activeSubscriber";
import { usePageProps } from "next-common/context/page";
import { CoretimeSaleProvider } from "next-common/context/coretime/sale/provider";

export function CoretimeActiveSaleProvider({ children }) {
  const { coretimeSale } = usePageProps();

  return (
    <CoretimeSaleProvider value={coretimeSale}>
      <CoretimeActiveSaleSubscriber>
        {children}
      </CoretimeActiveSaleSubscriber>
    </CoretimeSaleProvider>
  )
}
