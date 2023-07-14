import { useOnchainData, usePostState } from "next-common/context/post";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";
import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import PostMetaBase from "next-common/components/detail/container/postMeta/metaBase";
import UpdatedTime from "next-common/components/detail/common/UpdatedTime";
import CommentsMeta from "next-common/components/detail/container/postMeta/comments";
import React from "react";
import DetailLabels from "next-common/components/detail/common/labels";
import { DemocracyTag } from "next-common/components/tags/business";

function DemocracyReferendumState() {
  const onchain = useOnchainData();
  const state = usePostState();
  const args = getDemocracyStateArgs(onchain.state, onchain.timeline);

  return <DemocracyReferendumTag state={state} args={args} />;
}

export default function DemocracyReferendumMeta() {
  return (
    <PostMetaBase state={<DemocracyReferendumState />}>
      <div>
        <DemocracyTag />
      </div>
      <UpdatedTime />
      <CommentsMeta />
      <DetailLabels />
    </PostMetaBase>
  );
}
