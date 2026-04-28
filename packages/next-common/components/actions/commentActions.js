import React, { useRef, useState } from "react";
import CommentMoreMenu from "../articleMoreMenu/commentMoreMenu";
import ThumbsUp from "../thumbsUp";
import ThumbsDown from "../thumbsDown";
import ReplyButton from "./replyButton";
import ThumbUpList from "./thumbUpList";
import { Wrapper } from "./styled";
import CommentEditor from "../comment/editor";
import { usePost } from "next-common/context/post";
import { useUser } from "next-common/context/user";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import { useChain } from "next-common/context/chain";
import { noop } from "lodash-es";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useComment } from "../comment/context";
import { useCommentActions } from "next-common/sima/context/commentActions";
import {
  useFindMyUpVote,
  useFindMyDownVote,
} from "next-common/sima/actions/common";
import useCanEditComment from "next-common/hooks/useCanEditComment";
import {
  useRootCommentContext,
  useRootCommentData,
} from "../comment/rootComment";
import { usePageProperties } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";

function useMyUpVote(reactions) {
  const findMyUpVote = useFindMyUpVote();
  return findMyUpVote(reactions);
}

function useMyDownVote(reactions) {
  const findMyDownVote = useFindMyDownVote();
  return findMyDownVote(reactions);
}

function useShouldUseSima(comment) {
  const { supportSima } = useCommentActions();
  return supportSima && comment?.dataSource === "sima";
}

function SimaCommentContextMenu({ setIsEdit }) {
  const canEditComment = useCanEditComment();
  return <CommentMoreMenu editable={canEditComment} setIsEdit={setIsEdit} />;
}

function MaybeSimaCommentContextMenu({ setIsEdit }) {
  const comment = useComment();
  const ownComment = useIsOwnComment();
  const shouldUseSima = useShouldUseSima(comment);
  if (shouldUseSima) {
    return <SimaCommentContextMenu setIsEdit={setIsEdit} />;
  }
  return <CommentMoreMenu editable={ownComment} setIsEdit={setIsEdit} />;
}

function useIsOwnComment() {
  const comment = useComment();
  const user = useUser();
  const author = comment?.author || {};
  return user && author?.username === user.username;
}

export default function CommentActions({
  scrollToNewReplyComment = noop,
  setShowReplies = noop,
  setIsEdit,
}) {
  const comment = useComment();
  const user = useUser();
  const reactions = comment?.reactions || [];
  const author = comment?.author || {};
  const ownComment = useIsOwnComment();
  const myUpVote = useMyUpVote(reactions);
  const myDownVote = useMyDownVote(reactions);
  const thumbUp = !!myUpVote;
  const thumbDown = !!myDownVote;

  const chain = useChain();
  const post = usePost();
  const editorWrapperRef = useRef();
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [isReply, setIsReply] = useState(false);

  const users = useMentionList();

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
  const [reactionLoading, setReactionLoading] = useState(false);
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);
  const [showThumbsDownList, setShowThumbsDownList] = useState(false);

  const {
    upVoteComment,
    cancelUpVoteComment,
    downVoteComment,
    cancelDownVoteComment,
  } = useCommentActions();
  const { reloadRootComment } = useRootCommentContext();

  const toggleThumbUp = async () => {
    if (!user || ownComment || reactionLoading) {
      return;
    }

    setReactionLoading(true);
    try {
      let result, error;

      if (myUpVote) {
        ({ result, error } = await cancelUpVoteComment(post, comment));
      } else {
        ({ result, error } = await upVoteComment(post, comment));
      }

      if (result) {
        await reloadRootComment();
      }
      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
    } finally {
      setReactionLoading(false);
    }
  };

  const toggleThumbDown = async () => {
    if (!user || ownComment || reactionLoading) {
      return;
    }

    setReactionLoading(true);
    try {
      let result, error;

      if (myDownVote) {
        ({ result, error } = await cancelDownVoteComment(post, comment));
      } else {
        ({ result, error } = await downVoteComment(post, comment));
      }

      if (result) {
        await reloadRootComment();
      }
      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
    } finally {
      setReactionLoading(false);
    }
  };

  const replyToComment = useRootCommentData();
  const { type: detailType } = usePageProperties();
  const isGov2Referendum = detailType === detailPageCategory.GOV2_REFERENDUM;
  const downVotes = reactions.filter((r) => r.reaction === 0);
  const downVoteCount = downVotes.length;
  const upVotes = reactions.filter((r) => (r.reaction ?? 1) === 1);
  const upVoteCount = upVotes.length;

  return (
    <>
      <div className="flex items-center justify-between">
        <Wrapper className="space-x-4">
          <ReplyButton onReply={startReply} noHover={!user} />
          <ThumbsUp
            count={upVoteCount}
            noHover={!user || ownComment}
            highlight={thumbUp}
            toggleThumbUp={toggleThumbUp}
            thumbUpLoading={reactionLoading}
            showThumbsUpList={showThumbsUpList}
            setShowThumbsUpList={setShowThumbsUpList}
          />
          {isGov2Referendum && (
            <ThumbsDown
              count={downVoteCount}
              noHover={!user || ownComment}
              highlight={thumbDown}
              toggleThumbDown={toggleThumbDown}
              thumbDownLoading={reactionLoading}
              showThumbsDownList={showThumbsDownList}
              setShowThumbsDownList={setShowThumbsDownList}
            />
          )}
        </Wrapper>
        <MaybeSimaCommentContextMenu setIsEdit={setIsEdit} />
      </div>
      {showThumbsUpList && <ThumbUpList reactions={upVotes} />}
      {showThumbsDownList && <ThumbUpList reactions={downVotes} />}
      {isReply && (
        <CommentEditor
          replyToComment={replyToComment}
          ref={editorWrapperRef}
          setQuillRef={setQuillRef}
          isReply={isReply}
          onFinishedEdit={async (reload) => {
            setIsReply(false);
            if (reload) {
              setShowReplies(true);
              await reloadRootComment();
              scrollToNewReplyComment();
            }
          }}
          {...{ contentType, setContentType, content, setContent, users }}
        />
      )}
    </>
  );
}
