import useCall from "./useCall";
import getApi from "../../services/chain/api";
import { useSelector } from "react-redux";
import { currentNodeSelector } from "../../store/reducers/nodeSlice";
import { useChain } from "../../context/chain";

export default function useApi() {
  const chain = useChain();
  const endpoint = useSelector(currentNodeSelector);
  return useCall(getApi, [chain, endpoint]);
}
