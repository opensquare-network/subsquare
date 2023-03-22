import React from "react";
import { bountyBaseUrl } from "../../../../utils/postBaseUrl";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import TitleItem from "./infoItem/titleItem";
import ValueItem from "./infoItem/valueItem";

export default function TreasuryBountyProposedContent({ bountyIndex, data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={bountyIndex} baseUrl={bountyBaseUrl} />
      <ProposerItem proposer={data.proposer} />
      <ValueItem value={data.value} />
      <DescriptionItem description={data.description} />
    </>
  );
}
