import React from "react";
import DetailContentBase from "../../common/detailBase";
import PostTitle from "../../common/Title";
import PostMeta from "../../container/Meta";
import ArticleContent from "../../../articleContent";
import { usePost } from "../../../../context/post";
import TreasuryProposalNavigation from "../../navigation/treasuryProposalNavigation";
import useSetEdit from "../../common/hooks/useSetEdit";

export default function TreasuryProposalDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return <DetailContentBase>
    <TreasuryProposalNavigation />
    <PostTitle />
    <PostMeta />
    <ArticleContent
      post={post}
      onReply={onReply}
      setIsEdit={setIsEdit}
    />
  </DetailContentBase>;
}
