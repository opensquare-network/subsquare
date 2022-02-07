import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { currentNodeSelector } from "store/reducers/nodeSlice";
import { getApi } from "services/polkadotApi";
import { BN, BN_TWO, BN_THOUSAND, bnToBn, extractTime } from '@polkadot/util';

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

const DEFAULT_BLOCK_TIME = new BN(6_000);
const THRESHOLD = BN_THOUSAND.div(BN_TWO);

export function useBlockTime(blocks, chain) {
  const api = useApi(chain);
  const [blockTime, setBlockTime] = useState("");
  useEffect(() => {
    if (api) {
      const blockTime = (
        // Babe
        api.consts.babe?.expectedBlockTime ||
        // POW, eg. Kulupu
        api.consts.difficulty?.targetBlockTime ||
        // Subspace
        api.consts.subspace?.expectedBlockTime || (
          // Check against threshold to determine value validity
          api.consts.timestamp?.minimumPeriod.gte(THRESHOLD)
            // Default minimum period config
            ? api.consts.timestamp.minimumPeriod.mul(BN_TWO)
            : api.query.parachainSystem
              // default guess for a parachain
              ? DEFAULT_BLOCK_TIME.mul(TWO)
              // default guess for others
              : DEFAULT_BLOCK_TIME
        )
      );
      const value = blockTime.mul(bnToBn(blocks)).toNumber();
      const time = extractTime(Math.abs(value));
      const { days, hours, minutes, seconds } = time;
      const timeStr = [
        days ? (days > 1) ? `${days} days` : '1 day' : null,
        hours ? (hours > 1) ? `${hours} hrs` : '1 hr' : null,
        minutes ? (minutes > 1) ? `${minutes} mins` : '1 min' : null,
        seconds ? (seconds > 1) ? `${seconds} s` : '1 s' : null,
      ]
        .filter((s) => !!s)
        .slice(0, 2)
        .join(" ");

      setBlockTime(timeStr);
    }
  }, [api]);

  return blockTime;
}
