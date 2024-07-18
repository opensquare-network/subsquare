import { useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubLockedBalance(address) {
  const [balance, setBalance] = useState(0);
  useSubStorage("escrow", "locked", [address], (rawBalance) => {
    setBalance(rawBalance.amount.toString());
  });

  return balance;
}
