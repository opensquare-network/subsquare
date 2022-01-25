import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { userSelector } from "store/reducers/userSlice";
import { currentNodeSelector } from "store/reducers/nodeSlice";
import { getApi } from "services/polkadotApi";
import { getAddressVotingBalance, getAddressVote, getElectorate } from "./referendumUtil";

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

export function useAuthPage(isAuth) {
  return;
  const user = useSelector(userSelector);
  const router = useRouter();

  if (isAuth && !user) {
    router.replace("/");
  } else if (!isAuth && user) {
    router.replace("/");
  }
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
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api) {
      getElectorate(api, height).then((value) => {
        if (isMounted.current) {
          setElectorate(value);
        }
      });
    }
  }, [api, height]);
  return electorate;
}

export function useAddressVotingBalance(address) {
  const api = useApi("kintsugi");
  const [balance, setBalance] = useState(0);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api && address) {
      getAddressVotingBalance(api, address).then((value) => {
        if (isMounted.current) {
          setBalance(value);
        }
      });
    }
  }, [api, address]);
  return balance;
}

export function useAddressVote(referendumIndex, address) {
  const api = useApi("kintsugi");
  const [vote, setVote] = useState(null);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api && address) {
      getAddressVote(api, referendumIndex, address).then((vote) => {
        if (isMounted.current) {
          setVote(vote);
        }
      });
    }
  }, [api, referendumIndex, address]);
  return vote;
}
