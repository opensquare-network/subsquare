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
import { useComments } from "next-common/context/post/comments";
import { noop } from "lodash-es";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useComment } from "../comment/context";
import { useCommentActions } from "next-common/sima/context/commentActions";
import { useFindMyUpVote } from "next-common/sima/actions/common";

function useMyUpVote(reactions) {
  const findMyUpVote = useFindMyUpVote();
  return findMyUpVote(reactions);
}

export default function CommentActions({
  reloadComment = noop,
  scrollToNewReplyComment = noop,
  setShowReplies = noop,
  replyToCommentId,
  replyToComment,
  setIsEdit,
}) {
  const comment = useComment();
  const user = useUser();
  const reactions = comment?.reactions || [];
  const author = comment?.author || {};
  const ownComment = user && author?.username === user.username;
  const myUpVote = useMyUpVote(reactions);
  const thumbUp = !!myUpVote;

  const chain = useChain();
  const post = usePost();
  const editorWrapperRef = useRef();
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [isReply, setIsReply] = useState(false);
  const comments = useComments();

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

  const { upVoteComment, cancelUpVoteComment } = useCommentActions();

  const toggleThumbUp = async () => {
    if (!user || ownComment || thumbUpLoading) {
      return;
    }

    setThumbUpLoading(true);
    try {
      let result, error;

      if (myUpVote) {
        ({ result, error } = await cancelUpVoteComment(post, comment));
      } else {
        ({ result, error } = await upVoteComment(post, comment));
      }

      if (result) {
        await reloadComment();
      }
      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
    } finally {
      setThumbUpLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Wrapper className="space-x-4">
          <ReplyButton onReply={startReply} noHover={!user || ownComment} />
          <ThumbsUp
            count={reactions?.length}
            noHover={!user || ownComment}
            highlight={thumbUp}
            toggleThumbUp={toggleThumbUp}
            thumbUpLoading={thumbUpLoading}
            showThumbsUpList={showThumbsUpList}
            setShowThumbsUpList={setShowThumbsUpList}
          />
        </Wrapper>
        <CommentContextMenu editable={ownComment} setIsEdit={setIsEdit} />
      </div>
      {showThumbsUpList && <ThumbUpList reactions={reactions} />}
      {isReply && (
        <CommentEditor
          commentId={replyToCommentId}
          comment={replyToComment}
          ref={editorWrapperRef}
          setQuillRef={setQuillRef}
          isReply={isReply}
          onFinishedEdit={async (reload) => {
            setIsReply(false);
            if (reload) {
              setShowReplies(true);
              await reloadComment();
              scrollToNewReplyComment();
            }
          }}
          {...{ contentType, setContentType, content, setContent, users }}
        />
      )}
    </>
  );
}
