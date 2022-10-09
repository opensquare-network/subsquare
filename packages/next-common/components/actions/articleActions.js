import React from "react";
import { Wrapper } from "./styled";
import ReplyButton from "./replyButton";
import Share from "../shareSNS";
import { usePost } from "../../context/post";
import { useIsPostAuthor } from "../../context/post/useIsPostAuthor";
import { useIsThumbUp } from "../../context/post/isThumbUp";
import useThumbsUp from "../thumbsUp";
import ContentMenu from "../contentMenu";
import ThumbUpList from "./thumbUpList";
import { useIsLogin, useUser } from "../../context/user";

export default function ArticleActions({
  chain,
  onReply,
  toggleThumbUp,
  thumbUpLoading,
  setIsEdit,
}) {
  const user = useUser();
  const isLogin = useIsLogin();
  const post = usePost();
  const isAuthor = useIsPostAuthor();
  const thumbsUp = useIsThumbUp();
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
