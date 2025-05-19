import useCoretimeSale from "next-common/context/coretime/sale/provider";
import useChainOrScanHeight from "next-common/hooks/height";
import { isNil } from "lodash-es";
import { getCoretimePriceAt } from "next-common/utils/coretime/price";

export default function useCoretimeSalePrice() {
  const sale = useCoretimeSale();
  const { isFinal, info: saleInfo } = sale;
  const chainHeight = useChainOrScanHeight();
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
