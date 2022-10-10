import React from "react";
import ContentMenu from "../contentMenu";
import useThumbsUp from "../thumbsUp";
import ReplyButton from "./replyButton";
import ThumbUpList from "./thumbUpList";
import { Wrapper } from "./styled";

export default function CommentActions({
  chain,
  onReply,
  noHover,
  highlight,
  toggleThumbUp,
  thumbUpLoading,
  reactions,
  edit,
  setIsEdit,
  copy = false,
  onCopy = () => {},
}) {
  const count = reactions?.length;

  const { ThumbsUpComponent, showThumbsUpList } = useThumbsUp({
    count,
    noHover,
    highlight,
    toggleThumbUp,
    thumbUpLoading,
  });

  return (
    <>
      <Wrapper>
        <ReplyButton onReply={onReply} noHover={noHover} />
        {ThumbsUpComponent}
        {(copy || edit) && (
          <ContentMenu
            edit={edit}
            setIsEdit={setIsEdit}
            copy={copy}
            onCopy={onCopy}
            alwaysShow
          />
        )}
      </Wrapper>
      <ThumbUpList
        showThumbsUpList={showThumbsUpList}
        reactions={reactions}
        chain={chain}
      />
    </>
  );
}
