import PostMetaBase from "../../container/postMeta/metaBase";
import ReferendaState from "./state";
import UpdatedTime from "../UpdatedTime";
import CommentsMeta from "../../container/postMeta/comments";
import DetailLabels from "../labels";
import React from "react";
import ReferendaTrack from "./track";

export default function ReferendaPostMeta({ section = "referenda" }) {
  return (
    <PostMetaBase state={<ReferendaState />}>
      <ReferendaTrack section={section} />
      <UpdatedTime />
      <CommentsMeta />
      <DetailLabels />
    </PostMetaBase>
  );
}
