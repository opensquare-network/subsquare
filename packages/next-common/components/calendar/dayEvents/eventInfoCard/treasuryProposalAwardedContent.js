import React from "react";
import { treasuryProposalBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";

export default function treasuryProposalAwardedContent({ proposalIndex }) {
  return <IndexItem index={proposalIndex} baseUrl={treasuryProposalBaseUrl} />;
}
