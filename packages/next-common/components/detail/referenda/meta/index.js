import React from "react";
import PostMetaBase from "../../container/postMeta/metaBase";
import ReferendaPostTrack from "./track";
import UpdatedTime from "../../common/UpdatedTime";
import CommentsMeta from "../../container/postMeta/comments";
import ReferendaState from "../../common/openGov/state";
import DetailLabels from "../../common/labels";

export default function ReferendaPostMeta() {
  return <PostMetaBase state={ <ReferendaState /> }>
    <ReferendaPostTrack />
    <UpdatedTime />
    <CommentsMeta />
    <DetailLabels />
  </PostMetaBase>;
}
