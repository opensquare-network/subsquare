import React from "react";
import { usePost } from "../../../context/post";
import DetailContentBase from "../common/detailBase";
import PostTitle from "../common/Title";
import ArticleContent from "../../articleContent";
import ReferendaReferendumNavigation from "../navigation/referendaReferendumNavigation";
import useSetEdit from "../common/hooks/useSetEdit";
import ReferendaPostMeta from "../common/openGov/meta";
import ReferendaWhiteListNavigation from "./whitelistNavigation";

export default function ReferendaDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return <DetailContentBase>
    <ReferendaWhiteListNavigation />
    <ReferendaReferendumNavigation />
    <PostTitle />
    <ReferendaPostMeta />
    <ArticleContent
      post={post}
      onReply={onReply}
      setIsEdit={setIsEdit}
    />
  </DetailContentBase>;
}
