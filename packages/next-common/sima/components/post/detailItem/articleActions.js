import React, { useState } from "react";
import { Wrapper } from "next-common/components/actions/styled";
import ReplyButton from "next-common/components/actions/replyButton";
import Share from "next-common/components/shareSNS";
import { usePost } from "next-common/context/post";
import ThumbsUp from "next-common/components/thumbsUp";
import { useFocusEditor } from "next-common/context/post/editor";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ThumbUpList from "../../actions/thumbUpList";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { PostContextMenu } from "../../contentMenu";
import { useArticleActions } from "next-common/sima/context/articleActions";
import { isSameAddress } from "next-common/utils";
import useCanEditContent from "next-common/hooks/useCanEditContent";

export default function ArticleActions({
  extraActions,
  setIsAppend,
  setIsEdit,
}) {
  const post = usePost();
  const account = useConnectedAccount();
  const focusEditor = useFocusEditor();

  const dispatch = useDispatch();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  const isAuthor = isSameAddress(post?.proposer, account?.address);
  const canEdit = useCanEditContent(post);

  const reaction = post?.reactions?.find((r) =>
    isSameAddress(r.proposer, account?.address),
  );
  const thumbUp = !!reaction;
  const { cancelUpVote, upVote, reloadPost } = useArticleActions();

  const toggleThumbUp = async () => {
    if (!account || isAuthor || thumbUpLoading) {
      return;
    }

    setThumbUpLoading(true);
    try {
      let result;

      if (thumbUp) {
        result = await cancelUpVote(post, reaction.cid);
      } else {
        result = await upVote(post);
      }

      if (result.error) {
        dispatch(newErrorToast(result.error.message));
        return;
      }

      await reloadPost();
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
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

        {canEdit && (
          <PostContextMenu
            isAuthor={isAuthor}
            canEdit={canEdit}
            setIsAppend={setIsAppend}
            setIsEdit={setIsEdit}
          />
        )}
      </div>

      {showThumbsUpList && <ThumbUpList reactions={post?.reactions} />}
    </div>
  );
}
