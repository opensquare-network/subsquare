import React, { useRef, useState } from "react";
import ContentMenu from "../contentMenu";
import useThumbsUp from "../thumbsUp";
import ReplyButton from "./replyButton";
import ThumbUpList from "./thumbUpList";
import { Wrapper } from "./styled";
import CommentEditor from "../comment/editor";
import { usePost } from "next-common/context/post";
import { useUser } from "next-common/context/user";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import { useChain } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import noop from "lodash.noop";

export default function CommentActions({
  updateComment = noop,
  scrollToNewReplyComment = noop,
  setShowReplies = noop,
  replyToCommentId,
  author,
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
  const chain = useChain();
  const loginUser = useUser();
  const post = usePost();
  const editorWrapperRef = useRef();
  const count = reactions?.length;
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown",
  );
  const [isReply, setIsReply] = useState(false);
  const { comments } = usePageProps();

  const postId = post?._id;

  const users = useMentionList(post, comments);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  const onReply = getOnReply(
    contentType,
    content,
    setContent,
    quillRef,
    focusEditor,
    chain,
  );

  const startReply = () => {
    setIsReply(true);
    setTimeout(() => {
      onReply(author);
    }, 100);
  };

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
        <ReplyButton onReply={startReply} noHover={noHover} />
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
      <ThumbUpList showThumbsUpList={showThumbsUpList} reactions={reactions} />
      {isReply && (
        <CommentEditor
          postId={postId}
          commentId={replyToCommentId}
          ref={editorWrapperRef}
          setQuillRef={setQuillRef}
          isReply={isReply}
          onFinishedEdit={async (reload) => {
            setIsReply(false);
            if (reload) {
              setShowReplies(true);
              await updateComment();
              scrollToNewReplyComment();
            }
          }}
          {...{ contentType, setContentType, content, setContent, users }}
        />
      )}
    </>
  );
}
