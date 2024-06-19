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
import { noop } from "lodash-es";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useComment } from "next-common/components/comment/context";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import { getCookieConnectedAccount } from "next-common/utils/getCookieConnectedAccount";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { addressEllipsis } from "next-common/utils";

export default function CommentActions({
  updateComment = noop,
  scrollToNewReplyComment = noop,
  setShowReplies = noop,
  replyToCommentCid,
}) {
  const comment = useComment();
  const user = useUser();
  const { ensureConnect } = useEnsureLogin();
  const reactions = comment.reactions;
  const author = {
    username: addressEllipsis(comment.proposer),
    address: comment.proposer,
  };

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

  const account = useConnectedAccount();
  const ownComment = comment?.proposer === account?.address;
  const reaction = comment?.reactions?.find(
    (r) => r.proposer === account?.address,
  );
  const thumbUp = !!reaction;

  const signMessage = useSignMessage();

  const toggleThumbUp = async () => {
    if (!user || ownComment || thumbUpLoading) {
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
          `sima/comments/${comment.cid}/reactions`,
          data,
        ));
      } else {
        const connectedAccount = getCookieConnectedAccount();
        const entity = {
          action: "upvote",
          cid: comment.cid,
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
          `sima/comments/${comment.cid}/reactions`,
          data,
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
      {showThumbsUpList && <ThumbUpList reactions={reactions} />}
      {isReply && (
        <CommentEditor
          postCid={postCid}
          commentCid={replyToCommentCid}
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
