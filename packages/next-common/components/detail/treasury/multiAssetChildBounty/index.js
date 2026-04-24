import React from "react";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import { usePostState } from "next-common/context/post";
import PostMetaBase from "next-common/components/detail/container/postMeta/metaBase";
import { MultiAssetChildBountyTag } from "next-common/components/tags/state/treasury";
import CommonTreasuryMetaItems from "next-common/components/detail/treasury/common/commonMetaItems";

function MultiAssetChildBountyPostMeta() {
  const state = usePostState();

  return (
    <PostMetaBase state={<MultiAssetChildBountyTag state={state} />}>
      <CommonTreasuryMetaItems />
    </PostMetaBase>
  );
}

export default function MultiAssetChildBountyDetail() {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      title={<PostTitle />}
      meta={!isEditing && <MultiAssetChildBountyPostMeta />}
    >
      <MaybeSimaDiscussionArticleContent />
    </DetailContentBase>
  );
}
