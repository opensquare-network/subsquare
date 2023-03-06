import React from "react";
import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import { ItemValue, ItemWrapper } from "./infoItem/styled";

export default function DemocracyReferendumNotExecutedContent({
  referendumIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={referendumIndex} baseUrl={democracyReferendumBaseUrl} />
      <ItemWrapper>
        <span>Success:</span>
        <ItemValue>{data?.reason}</ItemValue>
      </ItemWrapper>
    </>
  );
}
