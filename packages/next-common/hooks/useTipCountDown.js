import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useTipCountDown() {
  const api = useContextApi();
  const [countDown, setCountDown] = useState();
  useEffect(() => {
    if (api && api.consts.tips) {
      setCountDown(api.consts.tips.tipCountdown.toNumber());
    }
  }, [api]);

  return countDown;
}
