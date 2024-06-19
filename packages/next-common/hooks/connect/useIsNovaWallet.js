import { useEffect, useState } from "react";
import { useMountedState } from "react-use";

export function useIsNovaWallet() {
  const [flag, setFlag] = useState(false);
  const isMounted = useMountedState();

  useEffect(() => {
    if (isMounted()) {
      setFlag(window.walletExtension?.isNovaWallet === true);
    }
  }, [isMounted]);

  return flag;
}
