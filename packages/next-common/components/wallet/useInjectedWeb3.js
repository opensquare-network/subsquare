import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useEffect, useState } from "react";

export default function useInjectedWeb3() {
  const isMounted = useIsMounted();
  const [injectedWeb3, setInjectedWeb3] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.injectedWeb3) {
        if (isMounted.current) {
          setLoading(false);
          setInjectedWeb3(window.injectedWeb3);
        }
      } else {
        setTimeout(() => {
          if (isMounted.current) {
            setLoading(false);
            setInjectedWeb3(window.injectedWeb3);
          }
        }, 1000);
      }
    }
  }, []);

  return { loading, injectedWeb3 };
}
