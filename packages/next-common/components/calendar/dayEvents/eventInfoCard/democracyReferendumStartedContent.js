import React from "react";
import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import { ItemWrapper } from "./infoItem/styled";

export default function DemocracyReferendumStartedContent({
  referendumIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={referendumIndex} baseUrl={democracyReferendumBaseUrl} />
      <ProposerItem proposer={data.proposer} />
      <ItemWrapper>
        <span>Threshold:</span>
        <span>{data?.meta?.threshold}</span>
      </ItemWrapper>
      <ItemWrapper>
        <span>End:</span>
        <span>Block #{data?.meta?.end}</span>
      </ItemWrapper>
      <ItemWrapper>
        <span>Delay:</span>
        <span>{data?.meta?.delay} blocks</span>
      </ItemWrapper>
    </>
  );
}
