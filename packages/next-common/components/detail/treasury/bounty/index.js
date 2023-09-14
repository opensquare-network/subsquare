import React from "react";
import { usePost } from "../../../../context/post";
import useSetEdit from "../../common/hooks/useSetEdit";
import DetailContentBase from "../../common/detailBase";
import ArticleContent from "../../../articleContent";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "next-common/components/styled/layout/divider";
import BountyCountDown from "next-common/components/detail/treasury/common/bountyCountDown";
import BountyPostMeta from "next-common/components/detail/treasury/common/bountyMeta";

export default function BountyDetail() {
  const post = usePost();
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase>
      {!isEditing && (
        <>
          <BountyCountDown data={post.onchainData} />
        </>
      )}
      <PostTitle />
      <Divider className="my-4" />
      <BountyPostMeta />
      <ArticleContent className="mt-6" post={post} setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}
