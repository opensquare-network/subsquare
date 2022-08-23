import React from "react";
import ContentMenu from "../contentMenu";
import useThumbsUp from "../thumbsUp";
import { Wrapper } from "./styled";
import ThumbUpList from "./thumbUpList";
import ReplyButton from "./replyButton";
import Share from "../shareSNS";

export default function ArticleActions({
  chain,
  onReply,
  noHover,
  highlight,
  toggleThumbUp,
  reactions,
  edit,
  setIsEdit,
  share2SNStext = "",
}) {
  const { ThumbsUpComponent, showThumbsUpList } = useThumbsUp({
    count: reactions?.length,
    noHover,
    highlight,
    toggleThumbUp,
  });

  return (
    <>
      <Wrapper>
        <ReplyButton onReply={onReply} noHover={noHover} />
        {ThumbsUpComponent}
        <Share share2SNStext={share2SNStext} />
        {edit && <ContentMenu edit={edit} setIsEdit={setIsEdit} alwaysShow />}
      </Wrapper>

      <ThumbUpList
        showThumbsUpList={showThumbsUpList}
        reactions={reactions}
        chain={chain}
      />
    </>
  );
}
