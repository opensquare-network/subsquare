import useCoretimeSale from "next-common/context/coretime/sale/provider";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import { getCoretimePriceAt } from "next-common/utils/coretime/price";

export default function useCoretimeSalePrice() {
  const sale = useCoretimeSale();
  const { isFinal, info: saleInfo } = sale;
  const chainHeight = useSelector(chainOrScanHeightSelector);
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
