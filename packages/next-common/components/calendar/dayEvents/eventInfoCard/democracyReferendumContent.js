import React from "react";
import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";

export default function DemocracyReferendumContent({ referendumIndex }) {
  return (
    <IndexItem index={referendumIndex} baseUrl={democracyReferendumBaseUrl} />
  );
}
