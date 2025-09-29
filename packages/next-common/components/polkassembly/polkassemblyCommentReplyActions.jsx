import React, { useCallback, useRef, useState } from "react";
import CommentMoreMenu from "next-common/components/articleMoreMenu/commentMoreMenu";
import ThumbsUp from "next-common/components/thumbsUp";
import ReplyButton from "next-common/components/actions/replyButton";
import ThumbUpList from "next-common/components/actions/thumbUpList";
import { Wrapper } from "next-common/components/actions/styled";
import PolkassemblyCommentReplyEditor from "./polkassemblyCommentReplyEditor";
import { usePost } from "next-common/context/post";
import { useUser } from "next-common/context/user";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import { useChain } from "next-common/context/chain";
import { useComments } from "next-common/context/post/comments";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useComment } from "next-common/components/comment/context";
import { useFindMyUpVote } from "next-common/sima/actions/common";
import nextApi from "next-common/services/nextApi";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useRootCommentContext } from "../comment/rootComment";

function useMyUpVote(reactions) {
  const findMyUpVote = useFindMyUpVote();
  return findMyUpVote(reactions);
}

function ContextMenu({ setIsEdit }) {
  const dispatch = useDispatch();
  const comment = useComment();
  const ownComment = useIsOwnComment();
  const { reloadRootComment } = useRootCommentContext();

  const deleteComment = useCallback(async () => {
    const { error } = await nextApi.delete(
      `polkassembly-comments/replies/${comment._id}`,
    );
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }
    reloadRootComment();
  }, [comment._id, dispatch, reloadRootComment]);

  return (
    <CommentMoreMenu
      editable={ownComment}
      setIsEdit={setIsEdit}
      customDeleteComment={deleteComment}
    />
  );
}

function useIsOwnComment() {
  const comment = useComment();
  const user = useUser();
  const author = comment?.author || {};
  return user && author?.username === user.username;
}

export default function PolkassemblyCommentReplyActions({
  setIsEdit,
  setShowReplies,
}) {
  const comment = useComment();
  const user = useUser();
  const reactions = comment?.reactions || [];
  const author = comment?.author || {};
  const ownComment = useIsOwnComment();
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
  const { ensureLogin } = useEnsureLogin();
  const { reloadRootComment } = useRootCommentContext();

  const upVoteComment = useCallback(async () => {
    const { error } = await nextApi.put(
      `polkassembly-comments/replies/${comment._id}/reaction`,
      { reaction: 1 },
      { credentials: "include" },
    );

    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }

    await reloadRootComment();
  }, [comment._id, dispatch, reloadRootComment]);

  const cancelUpVoteComment = useCallback(async () => {
    const { error } = await nextApi.delete(
      `polkassembly-comments/replies/${comment._id}/reaction`,
    );
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }
    await reloadRootComment();
  }, [comment._id, dispatch, reloadRootComment]);

  const toggleThumbUp = async () => {
    if (!user || ownComment || thumbUpLoading) {
      return;
    }

    setThumbUpLoading(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      if (myUpVote) {
        await cancelUpVoteComment();
      } else {
        await upVoteComment();
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
          <ReplyButton onReply={startReply} noHover={!user} />
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
        <ContextMenu setIsEdit={setIsEdit} />
      </div>
      {showThumbsUpList && <ThumbUpList reactions={reactions} />}
      {isReply && (
        <PolkassemblyCommentReplyEditor
          polkassemblyCommentId={comment.polkassemblyCommentId}
          ref={editorWrapperRef}
          setQuillRef={setQuillRef}
          isReply={isReply}
          onFinishedEdit={async (reload) => {
            setIsReply(false);
            if (reload) {
              setShowReplies(true);
              await reloadRootComment();
            }
          }}
          {...{ contentType, setContentType, content, setContent, users }}
        />
      )}
    </>
  );
}
