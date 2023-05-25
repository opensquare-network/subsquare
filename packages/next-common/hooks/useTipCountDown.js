import useApi from "../utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useTipCountDown() {
  const api = useApi();
  const [countDown, setCountDown] = useState();
  useEffect(() => {
    if (api && api.consts.tips) {
      setCountDown(api.consts.tips.tipCountdown.toNumber());
    }
  }, [api]);

  return countDown;
}
