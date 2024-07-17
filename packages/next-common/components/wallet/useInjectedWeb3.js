import { merge } from "lodash-es";
import { useEffect } from "react";
import { createGlobalState, useMountedState } from "react-use";

const useGlobalInjectedWeb3 = createGlobalState(null);

export default function useInjectedWeb3() {
  const isMounted = useMountedState();
  const [injectedWeb3, _setInjectedWeb3] = useGlobalInjectedWeb3();

  function setInjectedWeb3(value) {
    _setInjectedWeb3(merge(injectedWeb3, value));
  }

  useEffect(() => {
    function handleWeb3() {
      setInjectedWeb3(window.injectedWeb3);
    }

    if (isMounted()) {
      if (typeof window !== "undefined") {
        if (window.injectedWeb3) {
          handleWeb3();
        }
      } else {
        setTimeout(() => {
          handleWeb3();
        }, 1000);
      }
    }
  }, [isMounted]);

  return { injectedWeb3, setInjectedWeb3 };
}
