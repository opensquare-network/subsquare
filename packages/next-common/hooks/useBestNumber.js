import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";

export default function useBestNumber() {
  const api = useApi();
  const [bestNumber] = useCall(api?.derive?.chain?.bestNumber, []);
  return bestNumber?.toNumber();
}
