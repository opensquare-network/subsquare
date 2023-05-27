import React from "react";
import DetailContentBase from "../../common/detailBase";
import PostTitle from "../../common/Title";
import ArticleContent from "../../../articleContent";
import { usePost } from "../../../../context/post";
import TreasuryProposalNavigation from "../../navigation/treasuryProposalNavigation";
import useSetEdit from "../../common/hooks/useSetEdit";
import TreasuryProposalPostMeta from "./meta";

export default function TreasuryProposalDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return <DetailContentBase>
    <TreasuryProposalNavigation />
    <PostTitle />
    <TreasuryProposalPostMeta />
    <ArticleContent
      post={post}
      onReply={onReply}
      setIsEdit={setIsEdit}
    />
  </DetailContentBase>;
}
