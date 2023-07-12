import React from "react";
import { usePost } from "../../../../context/post";
import useSetEdit from "../../common/hooks/useSetEdit";
import DetailContentBase from "../../common/detailBase";
import ArticleContent from "../../../articleContent";

export default function BountyDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return (
    <DetailContentBase>
      <ArticleContent post={post} onReply={onReply} setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}
