import React from "react";
import { Wrapper } from "./styled";
import ReplyButton from "./replyButton";
import Share from "../shareSNS";
import { useSelector } from "react-redux";
import { isLoginSelector, userSelector } from "../../store/reducers/userSlice";
import { usePost, usePostType } from "../../context/post";
import isPostAuthor from "../../context/post/isPostAuthor";
import isThumbUp from "../../context/post/isThumbUp";
import useThumbsUp from "../thumbsUp";
import ContentMenu from "../contentMenu";
import ThumbUpList from "./thumbUpList";

export default function ArticleActions({
  chain,
  onReply,
  toggleThumbUp,
  thumbUpLoading,
  setIsEdit,
}) {
  const user = useSelector(userSelector);
  const isLogin = useSelector(isLoginSelector);
  const post = usePost();
  const type = usePostType();
  const isAuthor = isPostAuthor(user, post, type);
  const thumbsUp = isThumbUp(user, post);
  const { ThumbsUpComponent, showThumbsUpList } = useThumbsUp({
    count: post?.reactions?.length,
    noHover: !isLogin || isAuthor,
    highlight: thumbsUp,
    toggleThumbUp,
    thumbUpLoading,
  });

  return (
    <>
      <Wrapper>
        <ReplyButton onReply={onReply} noHover={!isLogin || isAuthor} />
        {ThumbsUpComponent}
        <Share />
        {isAuthor && <ContentMenu edit={isAuthor} setIsEdit={setIsEdit} alwaysShow />}
      </Wrapper>

      <ThumbUpList
        showThumbsUpList={showThumbsUpList}
        reactions={post?.reactions}
        chain={chain}
      />
    </>
  );
}
