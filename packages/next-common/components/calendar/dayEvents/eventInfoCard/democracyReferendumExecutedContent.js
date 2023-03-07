import React from "react";
import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import { ItemWrapper } from "./infoItem/styled";
import TitleItem from "./infoItem/titleItem";

export default function DemocracyReferendumExecutedContent({
  referendumIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={referendumIndex} baseUrl={democracyReferendumBaseUrl} />
      <TitleItem title={data?.postTitle} />
      <ItemWrapper>
        <span>Success:</span>
        <span>{data?.isOk ? "Yes" : "No"}</span>
      </ItemWrapper>
    </>
  );
}
