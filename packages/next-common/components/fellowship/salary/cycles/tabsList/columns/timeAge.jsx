import dayjs from "dayjs";
import Duration from "next-common/components/duration";
import { useState } from "react";

export function useFellowshipSalaryCycleTimeAgeColumn() {
  const [isTime, setIsTime] = useState(true);

  return {
    name: (
      <button
        className="text-theme500"
        onClick={() => {
          setIsTime(!isTime);
        }}
      >
        {isTime ? "Time" : "Age"}
      </button>
    ),
    className: "min-w-[160px]",
    cellRender(data) {
      const time = data?.paidIndexer?.blockTime;

      return (
        <div className="text-textTertiary">
          {isTime ? (
            dayjs(time).format("YYYY-MM-DD HH:mm:ss")
          ) : (
            <Duration time={time} />
          )}
        </div>
      );
    },
  };
}
