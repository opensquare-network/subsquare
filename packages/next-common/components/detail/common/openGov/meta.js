import PostMetaBase from "../../container/postMeta/metaBase";
import ReferendaState from "./state";
import UpdatedTime from "../UpdatedTime";
import CommentsMeta from "../../container/postMeta/comments";
import DetailLabels from "../labels";
import React from "react";
import ReferendaTrack from "./track";

export default function ReferendaPostMeta({ isFellowship = false }) {
  return <PostMetaBase state={ <ReferendaState /> }>
    <ReferendaTrack isFellowship={ isFellowship } />
    <UpdatedTime />
    <CommentsMeta />
    <DetailLabels />
  </PostMetaBase>;
}
