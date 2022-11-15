import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useConfirmingAt } from "next-common/context/post/gov2/referendum";
import { useConfirm } from "next-common/context/post/gov2/track";
import isNil from "lodash.isnil";

export default function useConfirmPercentage() {
  const latestHeight = useSelector(latestHeightSelector);
  const confirmingAt = useConfirmingAt();
  const confirmPeriod = useConfirm();
  if (isNil(latestHeight) || latestHeight <= confirmingAt) {
    return 0;
  }

  const finishHeight = confirmingAt + confirmPeriod;
  if (latestHeight >= finishHeight) {
    return 100;
  }

  const gone = latestHeight - confirmingAt;
  return (gone / confirmPeriod) * 100;
}
