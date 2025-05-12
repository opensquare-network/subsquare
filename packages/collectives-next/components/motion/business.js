import MultiKVList from "next-common/components/listInfo/multiKVList";
import { useCouncilMotionBusinessData } from "next-common/hooks/useCouncilMotionBusinessData";

export default function Business({ motion }) {
  const motionBusinessData = useCouncilMotionBusinessData();

  if (!motion) {
    return null;
  }

  return <MultiKVList title="Business" data={motionBusinessData} />;
}
