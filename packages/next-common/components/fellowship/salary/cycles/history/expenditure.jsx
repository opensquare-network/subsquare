import ValueDisplay from "next-common/components/valueDisplay";
import Progress from "next-common/components/progress";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPercentage, toPrecision } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

export default function FellowshipSalaryExpenditure({ cycle = {} }) {
  const { symbol, decimals } = useSalaryAsset();

  const { status = {} } = cycle || {};
  const { budget, totalRegistrations, totalUnregistrationsPaid } = status;

  const paid = totalRegistrations + totalUnregistrationsPaid || 0;

  const percentage = toPercentage(paid / budget);

  return (
    <div>
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
          className="h-1 my-1.5"
          percentage={percentage}
          fg="var(--theme500)"
          bg="var(--theme100)"
        />
      </Tooltip>
    </div>
  );
}
