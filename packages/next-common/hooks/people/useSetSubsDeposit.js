import { useState, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useDeepCompareEffect } from "react-use";

export default function useSetSubsDeposit(subAccounts = []) {
  const api = useContextApi();
  const [deposit, setDeposit] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const fetchDeposits = useCallback(async () => {
    if (!api || !api.consts.identity || !subAccounts || !subAccounts?.length) {
      setDeposit("0");
      return;
    }

    setIsLoading(true);

    try {
      const subAccountDeposit =
        api.consts.identity?.subAccountDeposit?.toString() || "0";

      const totalDeposit = (
        BigInt(subAccountDeposit) * BigInt(subAccounts.length)
      ).toString();

      setDeposit(totalDeposit);
    } catch (e) {
      setDeposit("0");
    } finally {
      setIsLoading(false);
    }
  }, [api, subAccounts]);

  useDeepCompareEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  return { deposit, isLoading };
}
