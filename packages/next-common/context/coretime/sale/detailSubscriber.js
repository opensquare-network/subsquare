import queryCoretimeDetailSale from "next-common/services/gql/coretime/detailSale";
import { useEffect, useState } from "react";
import { useInterval } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import { useSharedCoretimeSale } from "./provider";

export default function CoretimeDetailSaleSubscriber({ children }) {
  const [detailSale, setDetailSale] = useSharedCoretimeSale();
  const [saleData, setSaleData] = useState(null);
  const { blockTime } = useChainSettings();
  const { id, isFinal } = detailSale;

  const pollInterval = parseInt(blockTime) || 12000;
  useInterval(async () => {
    if (isFinal) {
      return;
    }

    try {
      const newSaleData = await queryCoretimeDetailSale(id);
      setSaleData(newSaleData);
    } catch (err) {
      throw new Error("Subscribe coretime detailSale failed.");
    }
  }, pollInterval);

  useEffect(() => {
    if (isFinal || !saleData) {
      return;
    }

    setDetailSale(saleData);
  }, [setDetailSale, saleData, isFinal]);

  return children;
}
