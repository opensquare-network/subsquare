import React, { useState } from "react";
import { Wrapper } from "next-common/components/actions/styled";
import ReplyButton from "next-common/components/actions/replyButton";
import Share from "next-common/components/shareSNS";
import {
  usePost,
  //usePostDispatch
} from "next-common/context/post";
// import { useIsPostAuthor } from "next-common/context/post/useIsPostAuthor";
// import { useIsThumbUp } from "next-common/context/post/isThumbUp";
import ThumbsUp from "next-common/components/thumbsUp";
// import { useUser } from "next-common/context/user";
import { useFocusEditor } from "next-common/context/post/editor";
import { useDispatch } from "react-redux";
// import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
// import fetchAndUpdatePost from "next-common/context/post/update";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { PostContextMenu } from "../../contentMenu";
import ThumbUpList from "../../actions/thumbUpList";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { getCookieConnectedAccount } from "next-common/utils/getCookieConnectedAccount";
import { useSignMessage } from "next-common/hooks/useSignMessage";

export default function ArticleActions({ setIsEdit, extraActions }) {
  // const user = useUser();
  const { ensureConnect } = useEnsureLogin();
  const post = usePost();
  // const isAuthor = useIsPostAuthor();
  const account = useConnectedAccount();
  // const thumbsUp = useIsThumbUp();
  const focusEditor = useFocusEditor();

  // const postDispatch = usePostDispatch();
  const dispatch = useDispatch();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  // const type = useDetailType();
  // const thumbUp = useIsThumbUp();
  const isAuthor = post?.proposer === account?.address;
  const reaction = post?.reactions?.find(
    (r) => r.proposer === account?.address,
  );
  const thumbUp = !!reaction;
  const signMessage = useSignMessage();

  const toggleThumbUp = async () => {
    if (!account || isAuthor || thumbUpLoading) {
      return;
    }

    setThumbUpLoading(true);
    try {
      if (!(await ensureConnect())) {
        return;
      }

      let result, error;

      if (thumbUp) {
        const connectedAccount = getCookieConnectedAccount();
        const entity = {
          action: "cancel_upvote",
          cid: reaction.cid,
          timestamp: Date.now(),
        };
        const address = connectedAccount.address;
        const signerWallet = connectedAccount.wallet;
        const signature = await signMessage(
          JSON.stringify(entity),
          address,
          signerWallet,
        );
        const data = {
          entity,
          address,
          signature,
          signerWallet,
        };

        ({ result, error } = await nextApi.post(
          `sima/discussions/${post.cid}/reaction`,
          data,
        ));
      } else {
        const connectedAccount = getCookieConnectedAccount();
        const entity = {
          action: "upvote",
          cid: post.cid,
          timestamp: Date.now(),
        };
        const address = connectedAccount.address;
        const signerWallet = connectedAccount.wallet;
        const signature = await signMessage(
          JSON.stringify(entity),
          address,
          signerWallet,
        );
        const data = {
          entity,
          address,
          signature,
          signerWallet,
        };

        ({ result, error } = await nextApi.post(
          `sima/discussions/${post.cid}/reaction`,
          data,
        ));
      }

      if (result) {
        //TODO: reload post
        // await fetchAndUpdatePost(postDispatch, type, post._id);
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

        {account && (
          <PostContextMenu editable={isAuthor} setIsEdit={setIsEdit} />
        )}
      </div>

      {showThumbsUpList && <ThumbUpList reactions={post?.reactions} />}
    </div>
  );
}
