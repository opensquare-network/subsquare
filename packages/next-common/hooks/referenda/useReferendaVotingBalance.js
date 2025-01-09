import { useMemo } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";

export default function useReferendaVotingBalance(address) {
  const api = useContextApi();
  const { value: result, loading } = useCall(api?.query?.system?.account, [
    address,
  ]);

  return useMemo(() => {
    if (loading || !result) {
      return {
        isLoading: loading,
        balance: null,
      };
    }

    const balanceBig =
      result.data.free.toBigInt() + result.data.reserved.toBigInt();
    return {
      isLoading: loading,
      balance: balanceBig.toString(),
    };
  }, [result, loading]);
}
