import React from "react";
import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";

export default function DemocracyReferendumContent({ referendumIndex, data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={referendumIndex} baseUrl={democracyReferendumBaseUrl} />
    </>
  );
}
