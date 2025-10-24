import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import { isNil } from "lodash-es";
import { getCoretimePriceAt } from "next-common/utils/coretime/price";
import useCoretimeCustomizedSaleInfo from "next-common/hooks/coretime/useCoretimeCustomizedSaleInfo";

export default function useCoretimeSalePrice() {
  const sale = useCoretimeSale();
  const { isFinal } = sale;
  const chainHeight = useRelayChainLatestHeight();
  const saleInfo = useCoretimeCustomizedSaleInfo();
  if (isFinal) {
    return {
      isLoading: false,
      price: null,
    };
  } else if (isNil(chainHeight)) {
    return {
      isLoading: true,
      price: null,
    };
  }

  return {
    isLoading: false,
    price: getCoretimePriceAt(chainHeight, saleInfo),
  };
}
