import DetailContentBase from "../../common/detailBase";
import PostTitle from "../../common/Title";
import PostMeta from "../../container/Meta";
import React from "react";
import ArticleContent from "../../../articleContent";
import { usePost } from "../../../../context/post";
import CloseCountDown from "./closeCountDown";
import useSetEdit from "../../common/hooks/useSetEdit";

export default function TipDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return <DetailContentBase>
    <CloseCountDown />
    <PostTitle />
    <PostMeta />
    <ArticleContent
      post={post}
      onReply={onReply}
      setIsEdit={setIsEdit}
    />
  </DetailContentBase>;
}
