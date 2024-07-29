import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";

export default function useBestNumber() {
  const api = useContextApi();
  const { value: bestNumber } = useCall(api?.derive?.chain?.bestNumber, []);
  return bestNumber?.toNumber();
}
