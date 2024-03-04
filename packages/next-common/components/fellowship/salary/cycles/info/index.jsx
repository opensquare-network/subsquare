import { usePageProps } from "next-common/context/page";
import FellowshipSalaryCycleDetailInfoClosed from "./closed";
import FellowshipSalaryCycleDetailInfoOngoing from "./ongoing";

export default function FellowshipSalaryCycleDetailInfo() {
  const { cycle } = usePageProps();

  return cycle.isFinal ? (
    <FellowshipSalaryCycleDetailInfoClosed cycle={cycle} />
  ) : (
    <FellowshipSalaryCycleDetailInfoOngoing cycle={cycle} />
  );
}
