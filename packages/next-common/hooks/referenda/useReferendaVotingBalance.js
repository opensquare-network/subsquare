import { useMemo } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";

export default function useReferendaVotingBalance(address) {
  const api = useContextApi();
  const { value: result, loading } = useCall(api?.query?.system?.account, [
    address,
  ]);

  const isReady = useMemo(() => {
    return api && address;
  }, [api, address]);

  return useMemo(() => {
    if (loading || !result || !isReady) {
      return {
        isLoading: loading || !isReady,
        balance: null,
        isReady,
      };
    }

    const balanceBig =
      result.data.free.toBigInt() + result.data.reserved.toBigInt();
    return {
      isLoading: loading || !isReady,
      balance: balanceBig.toString(),
      isReady,
    };
  }, [result, loading, isReady]);
}
