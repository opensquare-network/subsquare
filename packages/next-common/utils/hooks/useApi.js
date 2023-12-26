import getApi, { getBestApi } from "../../services/chain/api";
import { useDispatch, useSelector } from "react-redux";
import {
  currentNodeSelector,
  removeCurrentNode,
  setCurrentNode,
} from "../../store/reducers/nodeSlice";
import { useChain, useChainSettings } from "../../context/chain";
import { useEffect, useState } from "react";
import { getApiMap } from "next-common/services/chain/apis/new";

let lastApi;

export default function useApi() {
  const chain = useChain();
  const currentEndpoint = useSelector(currentNodeSelector);
  const [api, setApi] = useState();
  const apiMap = getApiMap();
  const dispatch = useDispatch();
  const { endpoints } = useChainSettings();

  useEffect(() => {
    if (currentEndpoint) {
      getApi(chain, currentEndpoint)
        .then((api) => {
          lastApi = api;
          setApi(api);
        })
        .catch(() => {
          if (endpoints.length > 1) {
            dispatch(removeCurrentNode()); // remove current node to trigger the best node selection
          }
        });
    } else {
      getBestApi(apiMap)
        .then((api) => {
          lastApi = api;
          setApi(api);
          const endpoint = api._options.provider.endpoint;
          dispatch(setCurrentNode({ url: endpoint, saveLocalStorage: false }));
        })
        .catch(() => {
          // ignore it
        });
    }
  }, [currentEndpoint, apiMap, dispatch, endpoints]);

  return api;
}

export function getLastApi() {
  if (!lastApi) {
    throw new Error("Use getLastApi after api initialized");
  }

  return lastApi;
}
