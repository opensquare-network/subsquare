import React from "react";
import ContentMenu from "../contentMenu";
import useThumbsUp from "../thumbsUp";
import { Wrapper } from "./styled";
import ThumbUpList from "./thumbUpList";
import ReplyButton from "./replyButton";
import Share from "../shareSNS";
import { useSelector } from "react-redux";
import { isPostAuthorSelector, thumbsUpSelector } from "../../store/selectors/post";
import { isLoginSelector } from "../../store/reducers/userSlice";
import { postSelector } from "../../store/reducers/postSlice";

export default function ArticleActions({
  chain,
  onReply,
  toggleThumbUp,
  setIsEdit,
}) {
  const isLogin = useSelector(isLoginSelector);
  const isAuthor = useSelector(isPostAuthorSelector);
  const thumbsUp = useSelector(thumbsUpSelector);
  const post = useSelector(postSelector)
  const { ThumbsUpComponent, showThumbsUpList } = useThumbsUp({
    count: post?.reactions?.length,
    noHover: !isLogin || isAuthor,
    highlight: thumbsUp,
    toggleThumbUp,
  });

  if (!post) {
    return null;
  }

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
