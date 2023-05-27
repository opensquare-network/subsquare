import DetailContentBase from "../../common/detailBase";
import PostTitle from "../../common/Title";
import React from "react";
import ArticleContent from "../../../articleContent";
import { usePost } from "../../../../context/post";
import CloseCountDown from "./closeCountDown";
import useSetEdit from "../../common/hooks/useSetEdit";
import TipPostMeta from "./meta";

export default function TipDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return <DetailContentBase>
    <CloseCountDown />
    <PostTitle />
    <TipPostMeta />
    <ArticleContent
      post={post}
      onReply={onReply}
      setIsEdit={setIsEdit}
    />
  </DetailContentBase>;
}
