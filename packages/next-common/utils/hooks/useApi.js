import useCall from "./useCall";
import getApi from "../../services/chain/api";
import { useSelector } from "react-redux";
import { currentNodeSelector } from "../../store/reducers/nodeSlice";
import { useChain } from "../../context/chain";

let api;

export default function useApi() {
  const chain = useChain();
  const endpoint = useSelector(currentNodeSelector);
  const [apiObj] = useCall(getApi, [chain, endpoint]);
  if (apiObj) {
    api = apiObj;
  }
  return apiObj;
}

export function getLastApi() {
  if (!api) {
    throw new Error("Use getLastApi after api initialized");
  }

  return api;
}
