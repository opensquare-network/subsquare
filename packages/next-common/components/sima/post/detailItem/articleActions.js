import React, { useCallback, useState } from "react";
import { Wrapper } from "next-common/components/actions/styled";
import ReplyButton from "next-common/components/actions/replyButton";
import Share from "next-common/components/shareSNS";
import {
  POST_UPDATE_ACTION,
  usePost,
  usePostDispatch,
} from "next-common/context/post";
import ThumbsUp from "next-common/components/thumbsUp";
import { useFocusEditor } from "next-common/context/post/editor";
import { useDispatch } from "react-redux";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ThumbUpList from "../../actions/thumbUpList";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { PostContextMenu } from "../../contentMenu";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";

export default function ArticleActions({ extraActions, setIsAppend }) {
  const post = usePost();
  const account = useConnectedAccount();
  const focusEditor = useFocusEditor();

  const postDispatch = usePostDispatch();
  const dispatch = useDispatch();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  const isAuthor = post?.proposer === account?.address;
  const reaction = post?.reactions?.find(
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

    return await nextApi.post(`sima/discussions/${post.cid}/reactions`, data);
  }, [post.cid, reaction?.cid, signSimaMessage]);

  const upVote = useCallback(async () => {
    const entity = {
      action: "upvote",
      cid: post.cid,
      timestamp: Date.now(),
    };
    const data = await signSimaMessage(entity);
    return await nextApi.post(`sima/discussions/${post.cid}/reactions`, data);
  }, [post.cid, signSimaMessage]);

  const toggleThumbUp = async () => {
    if (!account || isAuthor || thumbUpLoading) {
      return;
    }

    setThumbUpLoading(true);
    try {
      let result, error;

      if (thumbUp) {
        ({ result, error } = await cancelUpVote());
      } else {
        ({ result, error } = await upVote());
      }

      if (result) {
        const { result: newPost } = await nextApi.fetch(
          `posts/${post.postUid}`,
        );

        if (newPost) {
          postDispatch({
            type: POST_UPDATE_ACTION,
            post: newPost,
          });
        }
      }
      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } finally {
      setThumbUpLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <Wrapper className="space-x-4">
          <ReplyButton onReply={focusEditor} noHover={!account || isAuthor} />
          <ThumbsUp
            count={post?.reactions?.length}
            noHover={!account || isAuthor}
            highlight={thumbUp}
            toggleThumbUp={toggleThumbUp}
            thumbUpLoading={thumbUpLoading}
            showThumbsUpList={showThumbsUpList}
            setShowThumbsUpList={setShowThumbsUpList}
          />
          <Share />

          {extraActions}
        </Wrapper>

        {isAuthor && (
          <PostContextMenu editable={isAuthor} setIsAppend={setIsAppend} />
        )}
      </div>

      {showThumbsUpList && <ThumbUpList reactions={post?.reactions} />}
    </div>
  );
}
