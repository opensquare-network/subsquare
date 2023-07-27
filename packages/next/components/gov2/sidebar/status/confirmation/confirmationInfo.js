import { useConfirm } from "next-common/context/post/gov2/track";
import { ProgressInfo } from "../styled";
import TimeDuration from "next-common/components/TimeDuration";

export default function ConfirmationInfo() {
  const confirmPeriod = useConfirm();

  return (
    <ProgressInfo>
      <span>Confirmation</span>
      <span>
        <TimeDuration blocks={confirmPeriod} />
      </span>
    </ProgressInfo>
  );
}
