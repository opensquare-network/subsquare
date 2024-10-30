import queryCoretimeCurrentSale from "next-common/services/gql/coretime/currentSale";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useEffect, useState } from "react";
import { useInterval } from "react-use";
import { useChainSettings } from "next-common/context/chain";

export default function CoretimeActiveSaleSubscriber({ children }) {
  const [saleData, setSaleData] = useState(null);
  const [info, setInfo] = useState(null);
  const { blockTime } = useChainSettings();

  useInterval(async () => {
    try {
      const newSaleData = await queryCoretimeCurrentSale();
      setSaleData(newSaleData);
    } catch (err) {
      throw new Error("Subscribe coretime activeSale failed.");
    }
  }, [parseInt(blockTime) || 12000]);

  const { loading, result } = useSubStorage("broker", "saleInfo");

  useEffect(() => {
    if (loading) {
      return;
    }

    setInfo(result?.toJSON());
  }, [loading, result]);

  const activeSale = {
    ...saleData,
    info,
  };

  // TODO: setActiveSale
  // const [, setActiveSale] = useCoretimeActiveSale();
  return children;
}
