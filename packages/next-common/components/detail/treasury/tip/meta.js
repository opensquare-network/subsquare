import React from "react";
import { usePostState } from "../../../../context/post";
import PostMetaBase from "../../container/postMeta/metaBase";
import { TipTag } from "../../../tags/state/treasury";
import TreasuryTypeTag from "../common/treasuryTypeTag";
import UpdatedTime from "../../common/UpdatedTime";
import CommentsMeta from "../../container/postMeta/comments";
import DetailLabels from "../../common/labels";
import { TipStateMap } from "../../../../utils/viewfuncs/treasury/normalizeTipListItem";

export default function TipPostMeta() {
  const state = usePostState();

  return <PostMetaBase state={ <TipTag state={ TipStateMap[state] } /> }>
    <TreasuryTypeTag />
    <UpdatedTime />
    <CommentsMeta />
    <DetailLabels />
  </PostMetaBase>;
}
