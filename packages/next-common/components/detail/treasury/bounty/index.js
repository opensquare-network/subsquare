import React from "react";
import DetailContentBase from "../../common/detailBase";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import BountyCountDown from "next-common/components/detail/treasury/common/bountyCountDown";
import BountyPostMeta from "next-common/components/detail/treasury/common/bountyMeta";

export default function BountyDetail() {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={!isEditing && <BountyCountDown />}
      title={<PostTitle />}
      meta={<BountyPostMeta />}
    >
      <MaybeSimaDiscussionArticleContent />
    </DetailContentBase>
  );
}
