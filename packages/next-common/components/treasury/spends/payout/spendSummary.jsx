import { isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";

export default function SpendSummary({ spend, symbol }) {
  if (!spend) {
    return null;
  }

  return (
    <NeutralPanel className="flex flex-col gap-2 p-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex items-baseline gap-1 text12Medium text-textTertiary">
          Spend
          <span className="text12Bold text-textSecondary">#{spend.index}</span>
        </span>
        <span className="shrink-0 text16Bold text-textPrimary">
          {isNil(spend.amount) ? (
            "-"
          ) : (
            <ValueDisplay value={spend.amount} symbol={symbol} />
          )}
        </span>
      </div>
      <Tooltip className="block w-full" content={spend.title}>
        <span className="line-clamp-2 text14Medium text-textPrimary">
          {spend.title}
        </span>
      </Tooltip>
    </NeutralPanel>
  );
}
