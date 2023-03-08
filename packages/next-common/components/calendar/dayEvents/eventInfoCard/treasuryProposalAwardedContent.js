import React from "react";
import { treasuryProposalBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";

export default function treasuryProposalAwardedContent({ proposalIndex, data }) {
  return (
    <>
      <IndexItem index={proposalIndex} baseUrl={treasuryProposalBaseUrl} />
      <TitleItem title={data?.postTitle} />
    </>
  );
}
