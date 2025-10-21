import { isNil } from "lodash-es";
import {
  DetailAction,
  StatusValue,
  TimeValue,
  W3fDelegationValue,
} from "../common/cohortValueStyled";
import Descriptions from "next-common/components/Descriptions";
import dayjs from "dayjs";
import { Divider } from "../../trackPanel/lineItem";
import { usePageProps } from "next-common/context/page";
import DelegateCol from "./delegateCol";

export default function CohortsHistoryMobileList() {
  const { cohorts = [] } = usePageProps();
  const rows = cohorts.map((row) => {
    return (
      <div key={row.id}>
        <div className="mb-3">
          <div className="flex grow items-center justify-between">
            {row.id}
            <DetailAction row={row} />
          </div>
        </div>

        <Descriptions
          bordered={false}
          className="[&_.descriptions-item-label]:text-textTertiary [&_.descriptions-item]:h-auto [&_.descriptions-item]:my-2"
          items={[
            {
              label: "Start Time",
              value: (
                <TimeValue
                  time={dayjs(row.startIndexer?.blockTime).format(
                    "YYYY-MM-DD HH:mm:ss",
                  )}
                  blockNumber={row.startIndexer?.blockHeight}
                />
              ),
              className: "items-start",
            },
            row.endIndexer
              ? {
                  label: "End Time",
                  value: (
                    <TimeValue
                      time={dayjs(row.endIndexer?.blockTime).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                      blockNumber={row.endIndexer?.blockHeight}
                    />
                  ),
                  className: "items-start",
                }
              : null,
            {
              label: "Delegates",
              value: <DelegateCol row={row} />,
            },
            {
              label: "W3F Delegation",
              value: <W3fDelegationValue value={row.delegation} />,
            },
            {
              label: "Status",
              value: <StatusValue isClosed={!isNil(row.endIndexer)} />,
            },
          ].filter(Boolean)}
        />
        <Divider className="my-3" />
      </div>
    );
  });

  return rows;
}
