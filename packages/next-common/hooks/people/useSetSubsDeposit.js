import { useState, useMemo, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import { useDeepCompareEffect } from "react-use";

export function useSubAccountDeposit() {
  const api = useContextApi();
  const [deposit, setDeposit] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !api.consts.identity) {
      setIsLoading(false);
      return;
    }

    try {
      const subAccountDeposit =
        api.consts.identity?.subAccountDeposit?.toString() || "0";

      setDeposit(subAccountDeposit);
    } catch {
      setDeposit("0");
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return { deposit, isLoading };
}

export default function useSetSubsDeposit(subAccounts = []) {
  const { deposit: subAccountDeposit, isLoading: isDepositLoading } =
    useSubAccountDeposit();
  const [deposit, setDeposit] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const totalDeposit = useMemo(() => {
    if (!subAccounts || !subAccounts?.length || subAccountDeposit === "0") {
      return "0";
    }

    try {
      return (
        BigInt(subAccountDeposit) * BigInt(subAccounts.length)
      ).toString();
    } catch (e) {
      console.error("Error calculating total deposit:", e);
      return "0";
    }
  }, [subAccountDeposit, subAccounts]);

  useDeepCompareEffect(() => {
    setIsLoading(isDepositLoading);
    setDeposit(totalDeposit);
  }, [totalDeposit, isDepositLoading]);

  return { deposit, isLoading };
}
