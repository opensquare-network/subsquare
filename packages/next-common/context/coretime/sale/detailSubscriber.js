import queryCoretimeDetailSale from "next-common/services/gql/coretime/detailSale";
import { useInterval } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import { useSharedCoretimeSale } from "./provider";

export default function CoretimeDetailSaleSubscriber({ children }) {
  const [detailSale, setDetailSale] = useSharedCoretimeSale();
  const { blockTime } = useChainSettings();
  const { id, isFinal } = detailSale;

  const pollInterval = parseInt(blockTime) || 12000;
  useInterval(async () => {
    if (isFinal || !id) {
      return;
    }

    try {
      const newSaleData = await queryCoretimeDetailSale(id);
      setDetailSale(newSaleData);
    } catch (err) {
      throw new Error("Subscribe coretime detailSale failed.");
    }
  }, pollInterval);

  return children;
}
