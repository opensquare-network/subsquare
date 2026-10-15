import dayjs from "dayjs";
import { isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";
import useAhmLatestHeightSnapshot from "next-common/hooks/ahm/useAhmLatestHeightSnapshot";
import { calculateBlockTimestamp } from "next-common/hooks/common/useBlockTimestamp";
import { toPrecision } from "next-common/utils";
import { CORETIME_TIMESLICE_PERIOD } from "next-common/utils/consts/coretime";
import { CoreTimeTypes } from "../hooks/useAllCoreBrokers";
import TaskColumn from "./taskColumn";

function useTimesliceDate(timeslice) {
  const relayChainBlockTime = useRelayChainBlockTime();
  const { latestHeight, isLoading } = useAhmLatestHeightSnapshot();

  if (isNil(timeslice) || isLoading || isNil(latestHeight)) {
    return null;
  }

  const timestamp = calculateBlockTimestamp(
    Number(timeslice) * CORETIME_TIMESLICE_PERIOD,
    relayChainBlockTime,
    latestHeight,
  );

  return isNil(timestamp) ? null : dayjs(timestamp).format("YYYY-MM-DD");
}

function AutoRenewItem({ autoRenew }) {
  const nextRenewalDate = useTimesliceDate(autoRenew.nextRenewal);

  return (
    <Tooltip
      content={
        <div className="space-y-1">
          <div>Auto-renew is enabled for this core</div>
          {!isNil(autoRenew.task) && (
            <div className="flex items-center gap-x-1">
              <span>Task:</span>
              <TaskColumn item={{ isTask: true, taskId: autoRenew.task }} />
            </div>
          )}
          {!isNil(autoRenew.nextRenewal) && (
            <div>
              Next renewal period: #{autoRenew.nextRenewal.toLocaleString()}
              {nextRenewalDate ? ` (${nextRenewalDate})` : ""}
            </div>
          )}
        </div>
      }
    >
      <span className="text12Medium text-theme500">⚡ Auto-renew</span>
    </Tooltip>
  );
}

function RenewalItem({ renewal }) {
  const { decimals, symbol } = useChainSettings();
  const deadline = useTimesliceDate(renewal.when);
  const price = isNil(renewal.price) ? null : renewal.price.toString();
  const taskId = renewal.taskIds?.length === 1 ? renewal.taskIds[0] : null;

  return (
    <Tooltip
      content={
        <div className="space-y-1">
          <div>A renewal right is available for the next period</div>
          {!isNil(taskId) && (
            <div className="flex items-center gap-x-1">
              <span>Task:</span>
              <TaskColumn item={{ isTask: true, taskId }} />
            </div>
          )}
          <div className="flex items-center gap-x-1">
            <span>Renewal price:</span>
            {isNil(price) ? (
              <span>-</span>
            ) : (
              <ValueDisplay
                value={toPrecision(price, decimals)}
                symbol={symbol}
              />
            )}
          </div>
          {deadline && <div>Renew before {deadline}</div>}
        </div>
      }
    >
      <span className="text12Medium text-theme500">
        Renewable{deadline ? ` · by ${deadline}` : ""}
      </span>
    </Tooltip>
  );
}

function ExpireItem({ timeslice }) {
  const date = useTimesliceDate(timeslice);

  return (
    <Tooltip content="This core's current workload ends with the current period. Renew it or re-assign it for the next period.">
      <span className="text12Medium text-textTertiary">
        {date ? `Expires ${date}` : "-"}
      </span>
    </Tooltip>
  );
}

export default function RenewalColumn({ item }) {
  const coretimeSale = useCoretimeSale();

  if (item.autoRenew) {
    return <AutoRenewItem autoRenew={item.autoRenew} />;
  }

  if (item.renewal) {
    return <RenewalItem renewal={item.renewal} />;
  }

  if (item.isTask && item.occupancyType === CoreTimeTypes.BulkCoretime) {
    return <ExpireItem timeslice={coretimeSale?.info?.regionBegin} />;
  }

  return <span className="text-textTertiary">-</span>;
}
