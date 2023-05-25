import DetailContentBase from "../../common/detailBase";
import PostTitle from "../../common/Title";
import PostMeta from "../../container/Meta";
import React, { useCallback } from "react";
import ArticleContent from "../../../articleContent";
import { usePost } from "../../../../context/post";
import { useDispatch } from "react-redux";
import { setEditingPost } from "../../../../store/reducers/userSlice";
import CloseCountDown from "./closeCountDown";

export default function TipDetail({ onReply }) {
  const post = usePost();
  const dispatch = useDispatch();
  const setIsEdit = useCallback((editing) => {
    dispatch(setEditingPost(editing));
  }, [dispatch]);

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
