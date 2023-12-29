import getApi from "../../services/chain/api";
import { useDispatch, useSelector } from "react-redux";
import {
  currentNodeSelector,
  removeCurrentNode,
  setCurrentNode,
} from "../../store/reducers/nodeSlice";
import { useChain, useChainSettings } from "../../context/chain";
import { useEffect, useState } from "react";
import useCandidateNodes from "next-common/services/chain/apis/useCandidateNodes";

let lastApi;

export default function useApi() {
  const chain = useChain();
  const currentEndpoint = useSelector(currentNodeSelector);
  const [api, setApi] = useState();
  const dispatch = useDispatch();
  const { endpoints } = useChainSettings();
  const candidateNodes = useCandidateNodes();

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
      Promise.any(
        candidateNodes.map((endpoint) => getApi(chain, endpoint)),
      ).then((api) => {
        lastApi = api;
        setApi(api);
        const endpoint = api._options.provider.endpoint;
        dispatch(setCurrentNode({ url: endpoint, saveLocalStorage: false }));
      });
    }
  }, [currentEndpoint, chain, dispatch, endpoints, candidateNodes]);

  return api;
}

export function getLastApi() {
  if (!lastApi) {
    throw new Error("Use getLastApi after api initialized");
  }

  return lastApi;
}
