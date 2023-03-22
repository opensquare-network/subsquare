import React from "react";
import { bountyBaseUrl } from "../../../../utils/postBaseUrl";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import TitleItem from "./infoItem/titleItem";

export default function TreasuryBountyRejectedContent({ bountyIndex, data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={bountyIndex} baseUrl={bountyBaseUrl} />
      <ProposerItem proposer={data.proposer} />
      <DescriptionItem description={data.description} />
    </>
  );
}
