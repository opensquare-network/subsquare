import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";

export default function SalaryStatsBudgetItem({ budget }) {
  const { decimals, symbol } = getSalaryAsset();

  return (
    <SummaryItem title="Budget">
      <LoadableContent isLoading={isNil(budget)}>
        <ValueDisplay value={toPrecision(budget, decimals)} symbol={symbol} />
      </LoadableContent>
    </SummaryItem>
  );
}
