import { useSelector } from "react-redux";
import { currentNodeSelector } from "next-common/store/reducers/nodeSlice";
import useChainApi from "./useApi";

export default function useApi(chain) {
  const nodeUrl = useSelector(currentNodeSelector);
  return useChainApi(chain, nodeUrl);
}
