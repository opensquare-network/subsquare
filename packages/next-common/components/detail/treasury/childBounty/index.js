import { usePost } from "../../../../context/post";
import useSetEdit from "../../common/hooks/useSetEdit";
import DetailContentBase from "../../common/detailBase";
import ArticleContent from "../../../articleContent";
import React from "react";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "next-common/components/styled/layout/divider";
import BountyPostMeta from "next-common/components/detail/treasury/common/bountyMeta";
import ChildBountyCountDown from "next-common/components/detail/treasury/childBounty/countDown";

export default function ChildBountyDetail() {
  const post = usePost();
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase>
      {!isEditing && (
        <>
          <ChildBountyCountDown data={post.onchainData} />
        </>
      )}
      <PostTitle />
      <Divider className="my-4" />
      <BountyPostMeta />
      <ArticleContent post={post} setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}
