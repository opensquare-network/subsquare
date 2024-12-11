import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubLockedBalance(address) {
  const [balance, setBalance] = useState(null);
  useSubStorage("escrow", "locked", [address], {
    callback: useCallback((rawBalance) => {
      setBalance(rawBalance.amount.toString());
    }, []),
  });

  return balance;
}
