import React from "react";
import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import { ItemValue, ItemWrapper } from "./infoItem/styled";
import TitleItem from "./infoItem/titleItem";

export default function DemocracyReferendumNotExecutedContent({
  referendumIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={referendumIndex} baseUrl={democracyReferendumBaseUrl} />
      <TitleItem title={data?.postTitle} />
      <ItemWrapper>
        <span>Success:</span>
        <ItemValue>{data?.reason}</ItemValue>
      </ItemWrapper>
    </>
  );
}
