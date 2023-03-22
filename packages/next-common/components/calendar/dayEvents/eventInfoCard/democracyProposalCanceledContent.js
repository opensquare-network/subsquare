import React from "react";
import { democracyProposalBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";

export default function DemocracyProposalCanceledContent({ proposalIndex, data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={proposalIndex} baseUrl={democracyProposalBaseUrl} />
    </>
  );
}
