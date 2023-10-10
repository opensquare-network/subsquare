import { useCallback, useEffect, useRef, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
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
import copy from "copy-to-clipboard";
import { useUser } from "../../context/user";
import useCommentsAnchor from "../../utils/hooks/useCommentsAnchor";
import { useComments, useSetComments } from "next-common/context/post/comments";
import SystemUser from "../user/systemUser";
import { LinkSubsquare } from "@osn/icons/subsquare";
import Tooltip from "../tooltip";
import CommentItemTemplate from "./itemTemplate";
import { useIsUniversalPostComments } from "next-common/hooks/usePostComments";

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

export default function CommentItem({
  data: comment,
  replyToCommentId,
  isSecondLevel,
  updateTopLevelComment,
  scrollToTopLevelCommentBottom,
}) {
  const user = useUser();
  const dispatch = useDispatch();
  const refCommentTree = useRef();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
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
  const isLoggedIn = !!user;
  const ownComment = isLoggedIn && comment.author?.username === user.username;
  const thumbUp =
    isLoggedIn &&
    comment?.reactions?.findIndex((r) => r.user?.username === user.username) >
      -1;

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

  const scrollToCommentBottom = useCallback(() => {
    if (refCommentTree.current) {
      refCommentTree.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [refCommentTree]);

  const toggleThumbUp = async () => {
    if (isLoggedIn && !ownComment && !thumbUpLoading) {
      setThumbUpLoading(true);
      try {
        let result, error;

        if (thumbUp) {
          ({ result, error } = await nextApi.delete(
            `comments/${comment._id}/reaction`,
          ));
        } else {
          ({ result, error } = await nextApi.put(
            `comments/${comment._id}/reaction`,
            { reaction: 1 },
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
    }
  };

  const editComment = async (content, contentType) => {
    return await nextApi.patch(`comments/${commentId}`, {
      content: contentType === "html" ? prettyHTML(content) : content,
      contentType,
    });
  };

  return (
    <CommentItemTemplate
      ref={refCommentTree}
      data={comment}
      isSecondLevel={isSecondLevel}
      showReplies={showReplies}
      setShowReplies={setShowReplies}
      id={comment.height}
      highlight={highlight}
      user={<SystemUser user={comment.author} />}
      commentSource={
        isUniversalComments && (
          <Tooltip content="Post from SubSquare" className="ml-2">
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
                  content={comment.content}
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
                  await updateComment();
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
          updateComment={updateTopLevelComment || updateComment}
          scrollToNewReplyComment={
            scrollToTopLevelCommentBottom || scrollToCommentBottom
          }
          replyToCommentId={replyToCommentId}
          highlight={isLoggedIn && thumbUp}
          noHover={!isLoggedIn || ownComment}
          edit={ownComment}
          setIsEdit={setIsEdit}
          toggleThumbUp={toggleThumbUp}
          thumbUpLoading={thumbUpLoading}
          reactions={comment.reactions}
          author={comment.author}
          copy
          onCopy={() => {
            copy(
              `${window.location.origin}${window.location.pathname}${window.location.search}#${comment.height}`,
            );
          }}
        />
      }
      renderReply={(reply) => (
        <CommentItem
          key={reply._id}
          data={reply}
          replyToCommentId={replyToCommentId}
          isSecondLevel
          updateTopLevelComment={updateTopLevelComment || updateComment}
          scrollToTopLevelCommentBottom={
            scrollToTopLevelCommentBottom || scrollToCommentBottom
          }
        />
      )}
    />
  );
}
