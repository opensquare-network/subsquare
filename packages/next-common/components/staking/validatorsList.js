import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "../dataList";
import ScrollerX from "../styled/containers/scrollerX";
import { AddressUser } from "../user";
import { useAllValidators } from "next-common/hooks/staking/useAllValidators";
import { useActiveValidators } from "next-common/hooks/staking/useActiveValidators";
import { useMemo } from "react";
import { keyBy } from "lodash-es";
import usePaginationComponent from "../pagination/usePaginationComponent";
import ValueDisplay from "../valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

const colAccount = {
  name: "Account",
  style: { textAlign: "left", minWidth: "240px" },
  render: (item) => <AddressUser key="account" add={item.account} />,
};

const colCommission = {
  name: "Commission",
  style: { textAlign: "left", width: "140px", minWidth: "140px" },
  render: (item) => (
    <span className="text-textPrimary">{item.commission / 10000000}%</span>
  ),
};

function TotalStake({ item }) {
  const { symbol, decimals } = useChainSettings();
  if (item.total === undefined) {
    return <span className="text-textTertiary">-</span>;
  }
  return (
    <ValueDisplay value={toPrecision(item.total, decimals)} symbol={symbol} />
  );
}

const colTotalStake = {
  name: "Total Stake",
  style: { textAlign: "right", width: "140px", minWidth: "140px" },
  render: (item) => <TotalStake item={item} />,
};

function NominatorCount({ item }) {
  if (item.nominatorCount === undefined) {
    return <span className="text-textTertiary">-</span>;
  }
  return <span className="text-textPrimary">{item.nominatorCount}</span>;
}

const colNominatorCount = {
  name: "Nominator Count",
  style: { textAlign: "left", width: "140px", minWidth: "140px" },
  render: (item) => <NominatorCount item={item} />,
};

function useValidators() {
  const { validators: allValidators, loading: isAllValidatorsLoading } =
    useAllValidators();
  const { validators: activeValidators, loading: isActiveValidatorsLoading } =
    useActiveValidators();
  const validators = useMemo(() => {
    if (!allValidators || !activeValidators) {
      return null;
    }
    const activeValidatorsMap = keyBy(activeValidators, "account");
    return allValidators.map((validator) => ({
      ...validator,
      isActive: !!activeValidatorsMap[validator.account],
      ...(activeValidatorsMap[validator.account] || {}),
    }));
  }, [allValidators, activeValidators]);
  return {
    validators,
    loading: isAllValidatorsLoading || isActiveValidatorsLoading,
  };
}

const PAGE_SIZE = 50;

export default function ValidatorsList() {
  const { validators, loading } = useValidators();
  const columnsDef = [
    colAccount,
    colCommission,
    colNominatorCount,
    colTotalStake,
  ];
  const { page, component: pagination } = usePaginationComponent(
    validators?.length || 0,
    PAGE_SIZE,
  );
  const pagedValidators = useMemo(
    () => (validators || []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [validators, page],
  );

  return (
    <div>
      <SecondaryCard>
        <ScrollerX>
          <MapDataList
            columnsDef={columnsDef}
            data={pagedValidators}
            loading={loading}
            noDataText="No current validators"
          />
        </ScrollerX>
        {pagination}
      </SecondaryCard>
    </div>
  );
}
