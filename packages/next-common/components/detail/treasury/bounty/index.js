import React, { useMemo } from "react";
import DetailContentBase from "../../common/detailBase";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import BountyCountDown from "next-common/components/detail/treasury/common/bountyCountDown";
import BountyPostMeta from "next-common/components/detail/treasury/common/bountyMeta";
import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";

export default function BountyDetail() {
  const isEditing = useSelector(isEditingPostSelector);
  const { appendants } = useBountyAppendantsContext();

  const isFold = useMemo(() => {
    if (!appendants || appendants?.length === 0) {
      return false;
    }

    return true;
  }, [appendants]);

  return (
    <DetailContentBase
      head={!isEditing && <BountyCountDown />}
      title={<PostTitle />}
      meta={<BountyPostMeta />}
    >
      <MaybeSimaDiscussionArticleContent isFold={isFold} />
    </DetailContentBase>
  );
}
