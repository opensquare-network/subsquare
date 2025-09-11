import queryCoretimeCurrentSale from "next-common/services/gql/coretime/currentSale";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useEffect, useState } from "react";
import { useInterval } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import { useSharedCoretimeSale } from "./provider";

export default function CoretimeActiveSaleSubscriber({ children }) {
  const [, setActiveSale] = useSharedCoretimeSale();
  const [saleData, setSaleData] = useState(null);
  const [info, setInfo] = useState(null);
  const { blockTime } = useChainSettings();

  const pollInterval = parseInt(blockTime) || 12000;
  useInterval(async () => {
    try {
      const newSaleData = await queryCoretimeCurrentSale();
      setSaleData(newSaleData);
    } catch (err) {
      throw new Error("Subscribe coretime activeSale failed.");
    }
  }, pollInterval);

  const { loading, result } = useSubStorage("broker", "saleInfo");

  useEffect(() => {
    if (loading) {
      return;
    }

    setInfo(result?.toJSON());
  }, [loading, result]);

  useEffect(() => {
    if (loading || !saleData || !info) {
      return;
    }

    setActiveSale({
      ...saleData,
      info,
    });
  }, [setActiveSale, saleData, info, loading]);

  return children;
}
