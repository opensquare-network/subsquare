import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { currentNodeSelector } from "store/reducers/nodeSlice";
import { getApi } from "services/polkadotApi";
import {
  getAddressVote,
  getAddressVotingBalance,
  getElectorate,
} from "./referendumUtil";
import { BN_THOUSAND, BN_TWO, bnToBn, extractTime } from "@polkadot/util";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  });
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export function useForm(initialState = {}, onSubmit, clearError) {
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (clearError) clearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const reset = () => {
    setFormData(initialState);
  };

  return { formData, handleInputChange, handleSubmit, reset };
}

export function useIsMounted() {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

export function useCall(fn, params = []) {
  const [result, setResult] = useState();
  const isMounted = useIsMounted();
  useEffect(() => {
    if (fn) {
      fn(...params).then((value) => {
        if (isMounted.current) {
          setResult(value);
        }
      });
    }
  }, [fn, ...params]);
  return result;
}

export function useApi(chain) {
  const nodeUrl = useSelector(currentNodeSelector);
  const apiUrl = nodeUrl[chain];
  return useCall(getApi, [chain, apiUrl]);
}

export function useElectorate(height) {
  const api = useApi("kintsugi");
  const [electorate, setElectorate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api) {
      setIsLoading(true);
      getElectorate(api, height)
        .then((value) => {
          if (isMounted.current) {
            setElectorate(value);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [api, height]);
  return [electorate, isLoading];
}

export function useLoaded(isLoading) {
  const [loadStatus, setLoadStatus] = useState(0);
  useEffect(() => {
    if (loadStatus === 0 && isLoading) {
      setLoadStatus(1);
    }
    if (loadStatus === 1 && !isLoading) {
      setLoadStatus(2);
    }
  }, [isLoading]);
  return loadStatus === 2;
}

export function useAddressVotingBalance(address) {
  const api = useApi("kintsugi");
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api && address) {
      setIsLoading(true);
      getAddressVotingBalance(api, address)
        .then((value) => {
          if (isMounted.current) {
            setBalance(value);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setIsLoading(false);
          }
        });
    }
  }, [api, address]);
  return [balance, isLoading];
}

export function useAddressVote(referendumIndex, address) {
  const api = useApi("kintsugi");
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api && address) {
      setIsLoading(true);
      getAddressVote(api, referendumIndex, address)
        .then((vote) => {
          if (isMounted.current) {
            setVote(vote);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [api, referendumIndex, address]);
  return [vote, isLoading];
}

export function useBlockHeight() {
  const api = useApi("kintsugi");
  const [blockHeight, setBlockHeight] = useState();
  const isMounted = useIsMounted();
  useEffect(() => {
    let unsub = null;
    if (api) {
      api.rpc.chain
        .subscribeNewHeads((header) => {
          if (isMounted.current) {
            const height = header.number.toNumber();
            setBlockHeight(height);
          }
        })
        .then((res) => (unsub = res));

      return () => unsub?.();
    }
  }, [api]);
  return blockHeight;
}
