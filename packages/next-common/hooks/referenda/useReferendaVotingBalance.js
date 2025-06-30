import { useEffect, useMemo, useState } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";

export default function useReferendaVotingBalance(address) {
  const [ready, setReady] = useState(false);
  const api = useContextApi();
  const { value: result, loading } = useCall(api?.query?.system?.account, [
    address,
  ]);

  useEffect(() => {
    setReady(api && address);
  }, [api, address]);

  return useMemo(() => {
    if (loading || !result || !ready) {
      return {
        isLoading: loading,
        balance: null,
        ready,
      };
    }

    const balanceBig =
      result.data.free.toBigInt() + result.data.reserved.toBigInt();
    return {
      isLoading: loading,
      balance: balanceBig.toString(),
      ready,
    };
  }, [result, loading, ready]);
}
