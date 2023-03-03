import { techCommMotionBaseUrl } from "../../../../utils/postBaseUrl";
import MotionContent from "./motionContent";

export default function TechCommMotionContent({ motionHash, data }) {
  return (
    <MotionContent
      motionHash={motionHash}
      data={data}
      baseUrl={techCommMotionBaseUrl}
    />
  );
}
