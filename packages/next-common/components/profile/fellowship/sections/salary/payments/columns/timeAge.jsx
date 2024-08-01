import dayjs from "dayjs";
import Duration from "next-common/components/duration";
import { useToggle } from "react-use";

export function useProfileFellowshipSalaryPaymentTimeAgeColumn() {
  const [isTime, toggleIsTime] = useToggle(true);

  return {
    name: (
      <button className="text-theme500" onClick={toggleIsTime}>
        {isTime ? "Time" : "Age"}
      </button>
    ),
    minWidth: 160,
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
