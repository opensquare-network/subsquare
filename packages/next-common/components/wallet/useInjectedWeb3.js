import { useEffect, useState } from "react";
import { useMountedState } from "react-use";

export default function useInjectedWeb3() {
  const isMounted = useMountedState();
  const [injectedWeb3, setInjectedWeb3] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function handleWeb3() {
      setLoading(false);
      setInjectedWeb3(window.injectedWeb3);
    }

    if (isMounted()) {
      if (typeof window !== "undefined") {
        // Added for supporting PolkaGate Snap, when no other web3 wallets are available!
        if (window.injectedWeb3 || window.ethereum?.isMetaMask) {
          handleWeb3();
        }
      } else {
        setTimeout(() => {
          handleWeb3();
        }, 1000);
      }
    }
  }, [isMounted, window?.injectedWeb3]);

  return { loading, injectedWeb3 };
}
