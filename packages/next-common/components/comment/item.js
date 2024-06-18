import { useCallback, useEffect, useRef, useState } from "react";
import nextApi from "next-common/services/nextApi";
import EditInput from "next-common/components/editInput";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import {
  HtmlPreviewer,
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "../IdentityOrAddr";
import { prettyHTML } from "../../utils/viewfuncs";
import CommentActions from "../actions/commentActions";
import useCommentsAnchor from "../../utils/hooks/useCommentsAnchor";
import { useComments, useSetComments } from "next-common/context/post/comments";
import { LinkSubsquare } from "@osn/icons/subsquare";
import Tooltip from "../tooltip";
import CommentItemTemplate from "./itemTemplate";
import { useIsUniversalPostComments } from "next-common/hooks/usePostComments";
import { CommentProvider, useComment } from "./context";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import CommentUser from "./user";

function jumpToAnchor(anchorId) {
  var anchorElement = document.getElementById(anchorId);
  if (!anchorElement) {
    return;
  }
  var bodyRect = document.body.getBoundingClientRect();
  var elementRect = anchorElement.getBoundingClientRect();
  var offset = elementRect.top - bodyRect.top;
  var scrollPosition = offset - window.innerHeight / 2;
  window.scrollTo({
    top: scrollPosition,
    behavior: "smooth",
  });
}

function CommentItemImpl({
  replyToCommentId,
  isSecondLevel,
  updateTopLevelComment,
  scrollToTopLevelCommentBottom,
}) {
  const comment = useComment();
  const refCommentTree = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const isMounted = useIsMountedBool();
  const { hasAnchor, anchor } = useCommentsAnchor();
  const [showReplies, setShowReplies] = useState(false);
  const comments = useComments();
  const setComments = useSetComments();
  const isUniversalComments = useIsUniversalPostComments();

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

  const commentId = comment._id;

  const updateComment = useCallback(async () => {
    const { result: updatedComment } = await nextApi.fetch(
      `comments/${comment._id}`,
    );
    if (updatedComment) {
      const newComments = {
        ...comments,
        items: comments.items.map((item) => {
          if (item._id === updatedComment._id) {
            return updatedComment;
          }
          return item;
        }),
      };
      setComments(newComments);
    }
  }, [comments, setComments, comment._id]);

  const maybeUpdateTopLevelComment = updateTopLevelComment || updateComment;

  const scrollToCommentBottom = useCallback(() => {
    if (refCommentTree.current) {
      refCommentTree.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [refCommentTree]);

  const editComment = async (content, contentType) => {
    return await nextApi.patch(`comments/${commentId}`, {
      content: contentType === "html" ? prettyHTML(content) : content,
      contentType,
    });
  };

  return (
    <CommentItemTemplate
      ref={refCommentTree}
      isSecondLevel={isSecondLevel}
      showReplies={showReplies}
      setShowReplies={setShowReplies}
      id={comment.height}
      highlight={highlight}
      user={<CommentUser author={comment.author} />}
      commentSource={
        isUniversalComments && (
          <Tooltip content="Comment from SubSquare" className="ml-2">
            <LinkSubsquare className="w-4 h-4 [&_path]:fill-textTertiary" />
          </Tooltip>
        )
      }
      content={
        <>
          {!isEdit && (
            <>
              {comment.contentType === "markdown" && (
                <MarkdownPreviewer
                  content={comment.content || ""}
                  plugins={[
                    renderMentionIdentityUserPlugin(<IdentityOrAddr />),
                  ]}
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
          )}
          {isEdit && (
            <EditInput
              editContent={comment.content}
              editContentType={comment.contentType}
              onFinishedEdit={async (reload) => {
                if (reload) {
                  await maybeUpdateTopLevelComment();
                }
                if (isMounted()) {
                  setIsEdit(false);
                }
              }}
              update={editComment}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </>
      }
      actions={
        <CommentActions
          setShowReplies={setShowReplies}
          updateComment={maybeUpdateTopLevelComment}
          scrollToNewReplyComment={
            scrollToTopLevelCommentBottom || scrollToCommentBottom
          }
          replyToCommentId={replyToCommentId}
          setIsEdit={setIsEdit}
        />
      }
      renderReplyItem={(reply) =>
        reply.comment_source === "polkassembly" ? (
          <PolkassemblyCommentItem key={reply.id} data={reply} isSecondLevel />
        ) : (
          <CommentItem
            key={reply._id}
            data={reply}
            replyToCommentId={replyToCommentId}
            isSecondLevel
            updateTopLevelComment={maybeUpdateTopLevelComment}
            scrollToTopLevelCommentBottom={
              scrollToTopLevelCommentBottom || scrollToCommentBottom
            }
          />
        )
      }
    />
  );
}

export default function CommentItem({
  data,
  replyToCommentId,
  isSecondLevel,
  updateTopLevelComment,
  scrollToTopLevelCommentBottom,
  ...props
}) {
  return (
    <CommentProvider comment={data}>
      <CommentItemImpl
        replyToCommentId={replyToCommentId}
        isSecondLevel={isSecondLevel}
        updateTopLevelComment={updateTopLevelComment}
        scrollToTopLevelCommentBottom={scrollToTopLevelCommentBottom}
        {...props}
      />
    </CommentProvider>
  );
}
