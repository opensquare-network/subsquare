import { advisoryCommitteeBaseUrl } from "../../../../utils/postBaseUrl";
import MotionContent from "./motionContent";

export default function AdvisoryCommitteeContent({ motionHash, data }) {
  return (
    <MotionContent
      motionHash={motionHash}
      data={data}
      baseUrl={advisoryCommitteeBaseUrl}
    />
  );
}
