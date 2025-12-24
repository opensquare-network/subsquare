import { useAllValidators } from "next-common/hooks/staking/useAllValidators";
import { useState, useEffect, useMemo } from "react";
import BigNumber from "bignumber.js";

export default function useAverageCommission() {
  const { validators: allValidators, loading: isAllValidatorsLoading } =
    useAllValidators();
  const [averageCommission, setAverageCommission] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculatedAverage = useMemo(() => {
    if (!allValidators || allValidators.length === 0) {
      return null;
    }

    const { totalCommission, validCount } = allValidators.reduce(
      (acc, validator) => {
        const commission = validator?.commission;
        if (String(commission) === "1000000000") {
          return acc;
        }

        return {
          totalCommission: acc.totalCommission.plus(
            new BigNumber(commission || 0),
          ),
          validCount: acc.validCount + 1,
        };
      },
      { totalCommission: new BigNumber(0), validCount: 0 },
    );

    if (validCount === 0) {
      return null;
    }

    const average = totalCommission.dividedBy(validCount);

    return average.toString();
  }, [allValidators]);

  useEffect(() => {
    if (isAllValidatorsLoading) {
      setLoading(true);
      return;
    }

    setAverageCommission(calculatedAverage);
    setLoading(false);
  }, [calculatedAverage, isAllValidatorsLoading]);

  return {
    averageCommission,
    loading,
  };
}
