import { councilMotionBaseUrl } from "../../../../utils/postBaseUrl";
import MotionContent from "./motionContent";

export default function CouncilMotionContent({ motionHash, data }) {
  return (
    <MotionContent
      motionHash={motionHash}
      data={data}
      baseUrl={councilMotionBaseUrl}
    />
  );
}
