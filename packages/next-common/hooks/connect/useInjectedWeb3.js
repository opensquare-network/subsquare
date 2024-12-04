import { merge } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import { createGlobalState } from "react-use";

const useGlobalInjectedWeb3 = createGlobalState(null);

export default function useInjectedWeb3() {
  const [injectedWeb3, _setInjectedWeb3] = useGlobalInjectedWeb3();
  const [loading, setLoading] = useState(true);

  const setInjectedWeb3 = useCallback(
    (newValue) => {
      _setInjectedWeb3((oldValue) => merge(oldValue, newValue));
    },
    [_setInjectedWeb3],
  );

  useEffect(() => {
    function handleWeb3() {
      setLoading(false);
      setInjectedWeb3(window.injectedWeb3);
    }

    handleWeb3();
    const timeout1 = setTimeout(handleWeb3, 1000);
    const timeout2 = setTimeout(handleWeb3, 2000);
    const timeout3 = setTimeout(handleWeb3, 5000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [setInjectedWeb3]);

  return { loading, injectedWeb3, setInjectedWeb3 };
}
