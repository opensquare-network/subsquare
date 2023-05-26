import React from "react";
import { usePost } from "../../../context/post";
import DetailContentBase from "../common/detailBase";
import PostTitle from "../common/Title";
import PostMeta from "../container/Meta";
import ArticleContent from "../../articleContent";
import ReferendaReferendumNavigation from "../navigation/referendaReferendumNavigation";
import useSetEdit from "../common/hooks/useSetEdit";

export default function ReferendaDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return <DetailContentBase>
    <ReferendaReferendumNavigation />
    <PostTitle />
    <PostMeta />
    <ArticleContent
      post={post}
      onReply={onReply}
      setIsEdit={setIsEdit}
    />
  </DetailContentBase>;
}
