import React, { useCallback, useRef, useState } from "react";
import { CommentContextMenu } from "../contentMenu";
import SimaThumbUpList from "./thumbUpList";
import SimaCommentEditor from "../comment/editor";
import { usePost } from "next-common/context/post";
import { useUser } from "next-common/context/user";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import { useChain } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { noop } from "lodash-es";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useComment } from "next-common/components/comment/context";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import ReplyButton from "next-common/components/actions/replyButton";
import { Wrapper } from "next-common/components/actions/styled";
import ThumbsUp from "next-common/components/thumbsUp";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getUserObjFromAddress } from "next-common/utils/sima/utils";
import useSimaMentionList from "next-common/utils/sima/useSimaMentionList";

export default function SimaCommentActions({
  updateComment = noop,
  scrollToNewReplyComment = noop,
  setShowReplies = noop,
  replyToCommentCid,
}) {
  const comment = useComment();
  const user = useUser();
  const reactions = comment.reactions;
  const author = getUserObjFromAddress(comment.proposer);

  const chain = useChain();
  const post = usePost();
  const editorWrapperRef = useRef();
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [isReply, setIsReply] = useState(false);
  const { comments } = usePageProps();

  const postCid = post?.cid;

  const users = useSimaMentionList(post, comments);

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

  const account = useConnectedAccount();
  const ownComment = comment?.proposer === account?.address;
  const reaction = comment?.reactions?.find(
    (r) => r.proposer === account?.address,
  );
  const thumbUp = !!reaction;

  const signSimaMessage = useSignSimaMessage();

  const cancelUpVote = useCallback(async () => {
    const entity = {
      action: "cancel_upvote",
      cid: reaction.cid,
      timestamp: Date.now(),
    };
    const data = await signSimaMessage(entity);
    return await nextApi.post(`sima/comments/${comment.cid}/reactions`, data);
  }, [comment.cid, reaction?.cid, signSimaMessage]);

  const upVote = useCallback(async () => {
    const entity = {
      action: "upvote",
      cid: comment.cid,
      timestamp: Date.now(),
    };
    const data = await signSimaMessage(entity);
    return await nextApi.post(`sima/comments/${comment.cid}/reactions`, data);
  }, [comment.cid, signSimaMessage]);

  const toggleThumbUp = async () => {
    if (!user || ownComment || thumbUpLoading) {
      return;
    }

    setThumbUpLoading(true);
    try {
      let result;

      if (thumbUp) {
        result = await cancelUpVote();
      } else {
        result = await upVote();
      }

      if (result.error) {
        dispatch(newErrorToast(result.error.message));
        return;
      }

      await updateComment();
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
        <CommentContextMenu />
      </div>
      {showThumbsUpList && <SimaThumbUpList reactions={reactions} />}
      {isReply && (
        <SimaCommentEditor
          ref={editorWrapperRef}
          postCid={postCid}
          commentCid={replyToCommentCid}
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
