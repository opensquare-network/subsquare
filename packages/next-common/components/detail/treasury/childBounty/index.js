import { usePost } from "../../../../context/post";
import useSetEdit from "../../common/hooks/useSetEdit";
import DetailContentBase from "../../common/detailBase";
import ArticleContent from "../../../articleContent";
import React from "react";

export default function ChildBountyDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return (
    <DetailContentBase>
      <ArticleContent post={post} onReply={onReply} setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}
