import { useContextApi } from "next-common/context/api";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { useEffect, useState } from "react";

const DotTreasuryAccount = "13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB";
const KsmTreasuryAccount = "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";

export default function useTreasuryBalance() {
  const api = useContextApi();

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const chain = useChain();

  let treasuryAccount = null;

  if (chain === Chains.polkadot) {
    treasuryAccount = DotTreasuryAccount;
  } else if (chain === Chains.kusama) {
    treasuryAccount = KsmTreasuryAccount;
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!treasuryAccount) {
      return;
    }

    setLoading(true);
    api.query.system.account(DotTreasuryAccount).then((accountInfo) => {
      setBalance(accountInfo.data.free.toString());
      setLoading(false);
    });
  }, [api, treasuryAccount]);

  return {
    balance,
    loading,
  };
}
