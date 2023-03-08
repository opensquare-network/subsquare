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
      <IndexItem index={proposalIndex} baseUrl={democracyProposalBaseUrl} />
      <TitleItem title={data?.postTitle} />
      <ProposerItem proposer={data.proposer} />
    </>
  );
}
