import { isNil } from "lodash-es";
import { useEffect, useState } from "react";
import { useEvent, useMountedState } from "react-use";

export function useDetectEthereum({ timeout = 1000 } = {}) {
  const isMounted = useMountedState();
  const [ethereum, setEthereum] = useState();

  function handleEthereum() {
    if (!isNil(ethereum)) {
      return;
    }

    setEthereum(window.ethereum);
  }

  useEffect(() => {
    if (isMounted()) {
      if (window.ethereum) {
        handleEthereum();
      } else {
        setTimeout(() => {
          handleEthereum();
        }, timeout);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  useEvent(
    "ethereum#initialized",
    () => {
      handleEthereum();
    },
    window,
    { once: true },
  );

  return ethereum;
}
