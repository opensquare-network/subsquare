import React from "react";
import { usePost } from "../../../../context/post";
import DetailContentBase from "../../common/detailBase";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import BountyPostMeta from "next-common/components/detail/treasury/common/bountyMeta";
import ChildBountyCountDown from "next-common/components/detail/treasury/childBounty/countDown";

export default function ChildBountyDetail() {
  const post = usePost();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <ChildBountyCountDown data={post.onchainData} />
          </>
        )
      }
      title={<PostTitle />}
      meta={<BountyPostMeta isChild />}
    >
      <MaybeSimaDiscussionArticleContent />
    </DetailContentBase>
  );
}
