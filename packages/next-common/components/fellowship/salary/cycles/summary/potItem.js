import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function SalaryStatsPotItem({ pot }) {
  const { decimals, symbol } = useSalaryAsset();

  return (
    <SummaryItem title="Pot">
      <LoadableContent isLoading={isNil(pot)}>
        <ValueDisplay value={toPrecision(pot, decimals)} symbol={symbol} />
      </LoadableContent>
    </SummaryItem>
  );
}
