import React from "react";
import { bountyBaseUrl } from "../../../../utils/postBaseUrl";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";

export default function TreasuryBountyCanceledContent({ bountyIndex, data }) {
  return (
    <>
      <IndexItem index={bountyIndex} baseUrl={bountyBaseUrl} />
      <DescriptionItem description={data.description} />
    </>
  );
}
