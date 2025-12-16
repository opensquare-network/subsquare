import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";
import { AddressUser } from "next-common/components/user";
import Tooltip from "next-common/components/tooltip";
import { useMemo } from "react";
import { usePoolAccounts } from "next-common/hooks/staking/usePoolAccount";
import { useStakingLedgers } from "next-common/hooks/useStakingLedgers";

export function EmptyGuard({ value, children }) {
  if (isNil(value)) {
    return null;
  }
  return children;
}

export function TotalBondedColumn({ value }) {
  const { symbol, decimals } = useChainSettings();
  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

export function ValidatorsColumn({ poolId }) {
  const { stash, loading: isStashLoading } = usePoolAccounts(poolId);
  const { nominators, loading: isNominatorsLoading } = useStakingLedgers(stash);

  const validators = useMemo(() => nominators?.targets || [], [nominators]);

  const content = useMemo(() => {
    if (validators.length === 0) {
      return null;
    }
    return (
      <div className="flex flex-col gap-y-1 max-h-[400px] overflow-y-auto">
        {validators.map((validator) => (
          <div key={validator} className="text12Medium">
            <AddressUser className="text12Medium" add={validator} />
          </div>
        ))}
      </div>
    );
  }, [validators]);

  if (isStashLoading || isNominatorsLoading) {
    return null;
  }

  if (validators.length === 0) {
    return <span className="text-textTertiary">0</span>;
  }

  return <Tooltip content={content}>{validators.length}</Tooltip>;
}

export function CommissionColumn({ value }) {
  const commissionValue = value?.current?.[0];
  if (isNil(commissionValue) || commissionValue === 0) {
    return <span className="text-textTertiary">0.00%</span>;
  }

  return (
    <Tooltip content={`${commissionValue / 10000000}%`}>
      <span className="text-textPrimary">
        {(commissionValue / 10000000).toFixed(2)}%
      </span>
    </Tooltip>
  );
}
