import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { useSelector } from "react-redux";

export default function useCoretimeSaleIsInterlude() {
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const sale = useCoretimeSale();
  const {
    initIndexer: { blockHeight: initBlockHeight } = {},
    info: { saleStart } = {},
  } = sale || {};

  return chainHeight >= initBlockHeight && chainHeight <= saleStart;
}
