import React, { useRef, useState } from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import ThumbsUp from "next-common/components/thumbsUp";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";
import ReplyButton from "next-common/components/actions/replyButton";
import { useUser } from "next-common/context/user";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import { useChain } from "next-common/context/chain";
import PolkassemblyCommentReplyEditor from "./polkassemblyCommentReplyEditor";
import { noop } from "lodash-es";
import CommentEditor from "next-common/components/comment/editor";
import {
  useRootCommentContext,
  useRootCommentData,
} from "../comment/rootComment";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { useComment } from "../comment/context";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
`;

const GreyWrapper = styled(GreyPanel)`
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  margin-top: 16px;
`;

const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: var(--textSecondary);
  }
`;

export default function PolkassemblyActions({
  reactions,
  extraActions,
  setShowReplies = noop,
}) {
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);
  const thumbsUpReactions = (reactions || []).filter((r) => r.reaction === 1);
  const user = useUser();
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const chain = useChain();
  const comment = useComment();

  const [isReply, setIsReply] = useState(false);
  const editorWrapperRef = useRef();
  const [quillRef, setQuillRef] = useState(null);

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
      onReply(comment?.author);
    }, 100);
  };

  const postType = useDetailType();
  const isPolkassemblyDiscussion = postType === detailPageCategory.PA_POST;

  let editor = null;

  const replyToComment = useRootCommentData();
  const { reloadRootComment } = useRootCommentContext();

  if (replyToComment?.comment_source === "polkassembly") {
    editor = (
      <PolkassemblyCommentReplyEditor
        polkassemblyCommentId={replyToComment?.id}
        ref={editorWrapperRef}
        setQuillRef={setQuillRef}
        isReply={isReply}
        onFinishedEdit={async (reload) => {
          setIsReply(false);
          if (reload) {
            setShowReplies(true);
            reloadRootComment();
            // scrollToNewReplyComment();
          }
        }}
        {...{ contentType, setContentType, content, setContent, users }}
      />
    );
  } else {
    editor = (
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
            // scrollToNewReplyComment();
          }
        }}
        {...{ contentType, setContentType, content, setContent, users }}
      />
    );
  }

  return (
    <>
      <Wrapper className="space-x-4">
        {!isPolkassemblyDiscussion && (
          <ReplyButton onReply={startReply} noHover={!user} />
        )}
        <ThumbsUp
          disabled={true}
          count={thumbsUpReactions.length}
          noHover={true}
          highlight={false}
          showThumbsUpList={showThumbsUpList}
          setShowThumbsUpList={setShowThumbsUpList}
        />
        {extraActions}
      </Wrapper>
      {showThumbsUpList && thumbsUpReactions.length > 0 && (
        <GreyWrapper style={{ marginTop: 10 }}>
          {reactions
            .filter((r) => r.user)
            .map((r, index) => (
              <GreyItem key={index}>
                <PolkassemblyUser
                  user={r.user}
                  className="text12Medium text-textPrimary"
                  showAvatar={false}
                />
              </GreyItem>
            ))}
        </GreyWrapper>
      )}
      {isReply && editor}
    </>
  );
}
