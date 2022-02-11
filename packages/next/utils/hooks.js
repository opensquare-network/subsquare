import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { currentNodeSelector } from "store/reducers/nodeSlice";
import { bnToBn, extractTime } from "@polkadot/util";
import useChainApi from "next-common/utils/hooks/useApi";
import { useBlockTime } from "next-common/utils/hooks";

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

export function useApi(chain) {
  const nodeUrl = useSelector(currentNodeSelector);
  return useChainApi(chain, nodeUrl);
}

export function useEstimateBlockTime(blocks) {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const api = useApi(chain);
  const singleBlockTime = useBlockTime();
  const [estimatedTime, setEstimatedTime] = useState("");
  useEffect(() => {
    if (api && singleBlockTime) {
      const value = singleBlockTime.mul(bnToBn(blocks)).toNumber();
      const time = extractTime(Math.abs(value));
      const { days, hours, minutes, seconds } = time;
      const timeStr = [
        days ? (days > 1 ? `${days} days` : "1 day") : null,
        hours ? (hours > 1 ? `${hours} hrs` : "1 hr") : null,
        minutes ? (minutes > 1 ? `${minutes} mins` : "1 min") : null,
        seconds ? (seconds > 1 ? `${seconds} s` : "1 s") : null,
      ]
        .filter((s) => !!s)
        .slice(0, 2)
        .join(" ");

      setEstimatedTime(timeStr);
    }
  }, [blocks, api, singleBlockTime]);

  return estimatedTime;
}
