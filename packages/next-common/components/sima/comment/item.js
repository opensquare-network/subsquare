import { useCallback, useEffect, useRef, useState } from "react";
import {
  HtmlPreviewer,
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import { prettyHTML } from "next-common/utils/viewfuncs";
import CommentActions from "../actions/commentActions";
import useCommentsAnchor from "next-common/utils/hooks/useCommentsAnchor";
import CommentItemTemplate from "./itemTemplate";
import {
  CommentProvider,
  useComment,
} from "next-common/components/comment/context";
import CommentUser from "./user";
import jumpToAnchor from "next-common/utils/viewfuncs/jumpToAnchor";

function CommentItemImpl({
  replyToCommentCid,
  isSecondLevel,
  scrollToTopLevelCommentBottom,
}) {
  const comment = useComment();
  const refCommentTree = useRef();
  const [highlight, setHighlight] = useState(false);
  const { hasAnchor, anchor } = useCommentsAnchor();
  const [showReplies, setShowReplies] = useState(false);

  // Jump to comment when anchor is set
  useEffect(() => {
    if (!hasAnchor) {
      return;
    }

    setShowReplies(true);

    if (anchor === comment.height) {
      setHighlight(true);
      setTimeout(() => {
        jumpToAnchor(anchor);
      }, 100);
    }
  }, [hasAnchor, anchor]);

  const scrollToCommentBottom = useCallback(() => {
    if (refCommentTree.current) {
      refCommentTree.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [refCommentTree]);

  return (
    <CommentItemTemplate
      ref={refCommentTree}
      isSecondLevel={isSecondLevel}
      showReplies={showReplies}
      setShowReplies={setShowReplies}
      id={comment.height}
      highlight={highlight}
      user={<CommentUser address={comment.proposer} />}
      content={
        <>
          {comment.contentType === "markdown" && (
            <MarkdownPreviewer
              content={comment.content || ""}
              plugins={[renderMentionIdentityUserPlugin(<IdentityOrAddr />)]}
            />
          )}
          {comment.contentType === "html" && (
            <HtmlPreviewer
              content={prettyHTML(comment.content)}
              plugins={[
                renderMentionIdentityUserPlugin(<IdentityOrAddr />, {
                  targetElement: { tag: "span" },
                }),
              ]}
            />
          )}
        </>
      }
      actions={
        <CommentActions
          setShowReplies={setShowReplies}
          scrollToNewReplyComment={
            scrollToTopLevelCommentBottom || scrollToCommentBottom
          }
          replyToCommentCid={replyToCommentCid}
        />
      }
      renderReplyItem={(reply) => (
        <CommentItem
          key={reply._id}
          data={reply}
          replyToCommentCid={replyToCommentCid}
          isSecondLevel
          scrollToTopLevelCommentBottom={
            scrollToTopLevelCommentBottom || scrollToCommentBottom
          }
        />
      )}
    />
  );
}

export default function CommentItem({
  data,
  replyToCommentCid,
  isSecondLevel,
  updateTopLevelComment,
  scrollToTopLevelCommentBottom,
  ...props
}) {
  return (
    <CommentProvider comment={data}>
      <CommentItemImpl
        replyToCommentCid={replyToCommentCid}
        isSecondLevel={isSecondLevel}
        updateTopLevelComment={updateTopLevelComment}
        scrollToTopLevelCommentBottom={scrollToTopLevelCommentBottom}
        {...props}
      />
    </CommentProvider>
  );
}
