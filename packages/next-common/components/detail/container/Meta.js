import React from "react";
import TypeTag from "../common/TypeTag";
import UpdatedTime from "../common/UpdatedTime";
import Tag from "../../tags/state/tag";
import { usePost, usePostState } from "../../../context/post";
import { getMotionStateArgs } from "../../../utils/collective/result";
import { getGov2ReferendumStateArgs } from "../../../utils/gov2/result";
import { detailPageCategory } from "../../../utils/consts/business/category";
import { useDetailType } from "../../../context/page";
import IpfsLink from "../../alliance/ipfsLink";
import PostLabels from "../../postLabels";
import { getDemocracyStateArgs } from "../../../utils/democracy/result";
import PostMetaBase from "./postMeta/metaBase";
import CommentsMeta from "./postMeta/comments";

export default function PostMeta() {
  const postState = usePostState();
  const detailType = useDetailType();
  const post = usePost();

  let stateArgs;
  if (
    [
      detailPageCategory.COUNCIL_MOTION,
      detailPageCategory.TECH_COMM_MOTION,
    ].includes(detailType)
  ) {
    stateArgs = getMotionStateArgs(post.onchainData.state);
  } else if (
    [
      detailPageCategory.GOV2_REFERENDUM,
      detailPageCategory.FELLOWSHIP_REFERENDUM,
    ].includes(detailType)
  ) {
    stateArgs = getGov2ReferendumStateArgs(post.onchainData.state);
  } else if (detailPageCategory.DEMOCRACY_REFERENDUM === detailType) {
    stateArgs = getDemocracyStateArgs(post.onchainData.state, post.onchainData.timeline);
  }

  return <PostMetaBase
    state={ postState ? <Tag state={ postState } category={ detailType } args={ stateArgs } /> : null }
  >
    <TypeTag type={detailType} />
    <UpdatedTime />
    <CommentsMeta />
    {detailPageCategory.ALLIANCE_ANNOUNCEMENT === detailType && (
      <IpfsLink cid={post.cid} />
    )}
    <PostLabels labels={post.labels} />
  </PostMetaBase>;
}
