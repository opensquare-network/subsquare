import React from "react";
import ContentMenu from "../contentMenu";
import useThumbsUp from "../thumbsUp";
import { Wrapper } from "./styled";
import ThumbUpList from "./thumbUpList";
import ReplyButton from "./replyButton";
import Share from "../shareSNS";
import { useSelector } from "react-redux";
import { isPostAuthorSelector } from "../../store/selectors/post";
import { isLoginSelector } from "../../store/reducers/userSlice";

export default function ArticleActions({
  chain,
  onReply,
  highlight,
  toggleThumbUp,
  reactions,
  setIsEdit,
}) {
  const isLogin = useSelector(isLoginSelector);
  const isAuthor = useSelector(isPostAuthorSelector);
  const { ThumbsUpComponent, showThumbsUpList } = useThumbsUp({
    count: reactions?.length,
    noHover: !isLogin || isAuthor,
    highlight,
    toggleThumbUp,
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
        reactions={reactions}
        chain={chain}
      />
    </>
  );
}
