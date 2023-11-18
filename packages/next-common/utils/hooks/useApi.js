import getApi from "../../services/chain/api";
import { useSelector } from "react-redux";
import { currentNodeSelector } from "../../store/reducers/nodeSlice";
import { useChain } from "../../context/chain";
import { useEffect, useState } from "react";

let lastApi;

export default function useApi() {
  const chain = useChain();
  const endpoint = useSelector(currentNodeSelector);
  const [api, setApi] = useState();

  useEffect(() => {
    getApi(chain, endpoint).then((api) => {
      lastApi = api;
      setApi(api);
    });
  }, [endpoint]);

  return api;
}

export function getLastApi() {
  if (!lastApi) {
    throw new Error("Use getLastApi after api initialized");
  }

  return lastApi;
}
