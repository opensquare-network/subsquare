import React from "react";
import { democracyProposalBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import TitleItem from "./infoItem/titleItem";

export default function DemocracyProposalProposedContent({
  proposalIndex,
  data,
}) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={proposalIndex} baseUrl={democracyProposalBaseUrl} />
      <ProposerItem proposer={data.proposer} />
    </>
  );
}
