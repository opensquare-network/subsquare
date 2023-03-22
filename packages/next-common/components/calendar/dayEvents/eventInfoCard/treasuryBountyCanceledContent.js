import React from "react";
import { bountyBaseUrl } from "../../../../utils/postBaseUrl";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";

export default function TreasuryBountyCanceledContent({ bountyIndex, data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={bountyIndex} baseUrl={bountyBaseUrl} />
      <DescriptionItem description={data.description} />
    </>
  );
}
