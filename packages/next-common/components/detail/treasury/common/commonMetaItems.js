import React from "react";
import TreasuryTypeTag from "./treasuryTypeTag";
import UpdatedTime from "../../common/UpdatedTime";
import CommentsMeta from "../../container/postMeta/comments";
import DetailLabels from "../../common/labels";

export default function CommonTreasuryMetaItems() {
  return <>
    <TreasuryTypeTag />
    <UpdatedTime />
    <CommentsMeta />
    <DetailLabels />
  </>;
}
