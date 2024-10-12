import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useMemo } from "react";

export default function useReferendaVotingBalance(api, address) {
  const { loading, result } = useSubStorage("system", "account", [address], {
    api,
  });

  return useMemo(() => {
    if (loading || !result) {
      return {
        isLoading: loading,
        balance: null,
      };
    }

    const balanceBig = result.data.free.toBigInt() + result.data.reserved.toBigInt();
    return {
      isLoading: loading,
      balance: balanceBig.toString(),
    };
  }, [result, loading]);
}
