import { useCallback, useEffect, useRef, useState } from "react";
import EditInput from "next-common/components/editInput";
import { useMountedState } from "react-use";
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
import { useCommentActions } from "next-common/sima/context/commentActions";
import { usePost } from "next-common/context/post";
import { getRealField } from "next-common/sima/actions/common";
import useIsCommentProxyAuthor from "next-common/hooks/useIsCommentProxyAuthor";
import { useRouter } from "next/router";

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

function useIsShouldUseSimaCommentEdit() {
  const comment = useComment();
  const { supportSima } = useCommentActions();
  return supportSima && comment.dataSource === "sima";
}

function SimaEditInput({ update, ...props }) {
  const comment = useComment();
  const isProxyAuthor = useIsCommentProxyAuthor();
  return (
    <EditInput
      {...props}
      updateButtonText={isProxyAuthor ? "Update as a proxy" : "Update"}
      update={(content, contentType) =>
        update(
          content,
          contentType,
          isProxyAuthor ? comment.proposer : undefined,
        )
      }
    />
  );
}

function MaybeSimaEditInput(props) {
  const isUseSimaEdit = useIsShouldUseSimaCommentEdit();
  if (isUseSimaEdit) {
    return <SimaEditInput {...props} />;
  }
  return <EditInput {...props} />;
}

function CommentItemImpl({
  replyToCommentId,
  replyToComment,
  isSecondLevel,
  reloadTopLevelComment,
  scrollToTopLevelCommentBottom,
}) {
  const router = useRouter();
  const post = usePost();
  const comment = useComment();
  const refCommentTree = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const isMounted = useMountedState();
  const { hasAnchor, anchor } = useCommentsAnchor();
  const [showReplies, setShowReplies] = useState(false);
  const comments = useComments();
  const setComments = useSetComments();
  const isUniversalComments = useIsUniversalPostComments();
  const { getComment, updateComment } = useCommentActions();

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
  }, [hasAnchor, anchor, comment.height]);

  const reloadComment = useCallback(async () => {
    const { result: updatedComment } = await getComment(comment);
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
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments, setComments, comment._id]);

  const maybeReloadTopLevelComment = reloadTopLevelComment || reloadComment;

  const scrollToCommentBottom = useCallback(() => {
    if (refCommentTree.current) {
      refCommentTree.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [refCommentTree]);

  const editComment = async (content, contentType, realAddress) => {
    return await updateComment(
      post,
      replyToComment !== comment ? replyToComment : null,
      comment,
      content,
      contentType,
      getRealField(realAddress),
    );
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
                  markedOptions={{
                    breaks: true,
                  }}
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
            <MaybeSimaEditInput
              editContent={comment.content}
              editContentType={comment.contentType}
              onFinishedEdit={async (reload) => {
                if (reload) {
                  await maybeReloadTopLevelComment();
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
          reloadComment={maybeReloadTopLevelComment}
          scrollToNewReplyComment={
            scrollToTopLevelCommentBottom || scrollToCommentBottom
          }
          replyToCommentId={replyToCommentId}
          replyToComment={replyToComment}
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
            replyToComment={replyToComment}
            isSecondLevel
            reloadTopLevelComment={maybeReloadTopLevelComment}
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
  replyToComment,
  isSecondLevel,
  reloadTopLevelComment,
  scrollToTopLevelCommentBottom,
  ...props
}) {
  return (
    <CommentProvider comment={data}>
      <CommentItemImpl
        replyToCommentId={replyToCommentId}
        replyToComment={replyToComment}
        isSecondLevel={isSecondLevel}
        reloadTopLevelComment={reloadTopLevelComment}
        scrollToTopLevelCommentBottom={scrollToTopLevelCommentBottom}
        {...props}
      />
    </CommentProvider>
  );
}
