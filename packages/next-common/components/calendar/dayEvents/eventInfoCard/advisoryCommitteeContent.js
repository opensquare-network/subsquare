import React from "react";
import { advisoryCommitteeBaseUrl } from "../../../../utils/postBaseUrl";
import MotionContent from "./motionContent";

export default function AdvisoryCommitteeContent({ hash, data }) {
  return (
    <MotionContent
      motionHash={hash}
      data={data}
      baseUrl={advisoryCommitteeBaseUrl}
    />
  );
}
