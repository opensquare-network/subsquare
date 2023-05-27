import PostMetaBase from "../../container/postMeta/metaBase";
import UpdatedTime from "../../common/UpdatedTime";
import CommentsMeta from "../../container/postMeta/comments";
import DetailLabels from "../../common/labels";
import React from "react";
import { TreasuryTag as TreasuryStateTag } from "../../../tags/state/treasury";
import { usePostState } from "../../../../context/post";
import TreasuryTypeTag from "../common/treasuryTypeTag";

export default function TreasuryProposalPostMeta() {
  const state = usePostState();

  return <PostMetaBase state={ <TreasuryStateTag state={ state } /> }>
    <TreasuryTypeTag />
    <UpdatedTime />
    <CommentsMeta />
    <DetailLabels />
  </PostMetaBase>;
}
