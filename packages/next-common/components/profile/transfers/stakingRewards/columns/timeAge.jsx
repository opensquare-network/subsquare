import dayjs from "dayjs";
import Duration from "next-common/components/duration";
import { useState } from "react";

export function useStakingRewardsTimeAgeColumn() {
  const [isTime, setIsTime] = useState(true);

  return {
    name: (
      <button className="text-theme500" onClick={() => setIsTime((v) => !v)}>
        {isTime ? "Time" : "Age"}
      </button>
    ),
    style: { textAlign: "left", width: "200px", minWidth: "200px" },
    render: (item) =>
      isTime ? (
        <span key="time" className="text-textSecondary">
          {dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      ) : (
        <Duration key="time" time={item.indexer.blockTime} />
      ),
  };
}
