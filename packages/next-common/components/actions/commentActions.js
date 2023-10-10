import React, { useRef, useState } from "react";
import { CommentContextMenu } from "../contentMenu";
import ThumbsUp from "../thumbsUp";
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
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useComment } from "../comment/context";

export default function CommentActions({
  updateComment = noop,
  scrollToNewReplyComment = noop,
  setShowReplies = noop,
  replyToCommentId,
  setIsEdit,
}) {
  const comment = useComment();
  const user = useUser();
  const reactions = comment.reactions;
  const author = comment.author;
  const isLoggedIn = !!user;
  const ownComment = isLoggedIn && author?.username === user.username;
  const thumbUp =
    isLoggedIn &&
    reactions?.findIndex((r) => r.user?.username === user.username) > -1;

  const chain = useChain();
  const loginUser = useUser();
  const post = usePost();
  const editorWrapperRef = useRef();
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

  const dispatch = useDispatch();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  const toggleThumbUp = async () => {
    if (isLoggedIn && !ownComment && !thumbUpLoading) {
      setThumbUpLoading(true);
      try {
        let result, error;

        if (thumbUp) {
          ({ result, error } = await nextApi.delete(
            `comments/${comment._id}/reaction`,
          ));
        } else {
          ({ result, error } = await nextApi.put(
            `comments/${comment._id}/reaction`,
            { reaction: 1 },
          ));
        }

        if (result) {
          await updateComment();
        }
        if (error) {
          dispatch(newErrorToast(error.message));
        }
      } finally {
        setThumbUpLoading(false);
      }
    }
  };

  return (
    <>
      <Wrapper>
        <ReplyButton onReply={startReply} noHover={!isLoggedIn || ownComment} />
        <ThumbsUp
          count={reactions?.length}
          noHover={!isLoggedIn || ownComment}
          highlight={isLoggedIn && thumbUp}
          toggleThumbUp={toggleThumbUp}
          thumbUpLoading={thumbUpLoading}
          showThumbsUpList={showThumbsUpList}
          setShowThumbsUpList={setShowThumbsUpList}
        />
        <CommentContextMenu editable={ownComment} setIsEdit={setIsEdit} />
      </Wrapper>
      {showThumbsUpList && <ThumbUpList reactions={reactions} />}
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
