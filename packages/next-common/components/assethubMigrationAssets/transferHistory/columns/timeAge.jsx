import { useChain } from "next-common/context/chain";
import {
  TimeAgeCell,
  TimeAgeToggle,
  useTimeAge,
} from "next-common/components/timeAge";

export function useAssetsTransfersHistoryTimeAgeColumn() {
  const { isTime, onToggle } = useTimeAge();
  const chain = useChain();

  return {
    name: <TimeAgeToggle isTime={isTime} onToggle={onToggle} />,
    className: "min-w-[150px]",
    render(item) {
      return (
        <TimeAgeCell
          indexer={item?.indexer}
          isTime={isTime}
          customDomain={`assethub-${chain}`}
        />
      );
    },
  };
}
