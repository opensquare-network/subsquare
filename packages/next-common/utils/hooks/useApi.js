import useCall from "./useCall";
import getApi from "../../services/chain/api";

export default function useApi(chain, endpoint) {
  return useCall(getApi, [chain, endpoint]);
}
