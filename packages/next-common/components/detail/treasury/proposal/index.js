import React from "react";
import DetailContentBase from "../../common/detailBase";
import PostTitle from "../../common/Title";
import PostMeta from "../../container/Meta";
import ArticleContent from "../../../articleContent";
import { useDispatch } from "react-redux";
import { setEditingPost } from "../../../../store/reducers/userSlice";
import { useCallback } from "react";
import { usePost } from "../../../../context/post";
import TreasuryProposalNavigation from "../../navigation/treasuryProposalNavigation";

export default function TreasuryProposalDetail({ onReply }) {
  const post = usePost();
  const dispatch = useDispatch();
  const setIsEdit = useCallback((editing) => {
    dispatch(setEditingPost(editing));
  }, [dispatch]);

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
