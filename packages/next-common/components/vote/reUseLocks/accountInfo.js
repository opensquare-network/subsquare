import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import { useMemo } from "react";
import { extractAccountInfo } from "next-common/utils/account/extractAccountInfo";
import { useSubAccount } from "next-common/hooks/account/useSubAccount";

export function useSubAccountInfo(address) {
  const existentialDeposit = useQueryExistentialDeposit();
  const data = useSubAccount(address);

  const info = useMemo(() => {
    if (!data?.data) {
      return null;
    }
    return extractAccountInfo(data?.data, existentialDeposit);
  }, [data, existentialDeposit]);

  return { info, isLoading: data?.isLoading };
}
