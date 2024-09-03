import ValueDisplay from "next-common/components/valueDisplay";
import Progress from "next-common/components/progress";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPercentage, toPrecision } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import bigAdd from "next-common/utils/math/bigAdd";

export default function FellowshipSalaryExpenditure({ cycle = {} }) {
  const { symbol, decimals } = getSalaryAsset();

  const { status = {}, registeredPaid, unRegisteredPaid } = cycle || {};
  const { budget } = status;
  const paid = bigAdd(registeredPaid, unRegisteredPaid) || 0;

  const percentage = toPercentage(paid / budget);

  return (
    <div className="max-sm:text-right">
      <div>
        <ValueDisplay
          className="[&_.value-display-symbol]:hidden"
          symbol={symbol}
          value={toPrecision(paid, decimals)}
        />{" "}
        <div className="inline-block text-textTertiary">
          /{" "}
          <ValueDisplay symbol={symbol} value={toPrecision(budget, decimals)} />
        </div>
      </div>

      <Tooltip className="block" content={`${percentage}%`}>
        <Progress
          className="h-1 my-1.5 max-sm:w-32"
          percentage={percentage}
          fg="var(--theme500)"
          bg="var(--theme100)"
        />
      </Tooltip>

      <div className="text12Medium text-textSecondary hidden max-sm:block">
        {percentage}%
      </div>
    </div>
  );
}
