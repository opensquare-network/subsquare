import { useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import User from "next-common/components/user";
import EditInput from "next-common/components/editInput";
import Flex from "next-common/components/styled/flex";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import {
  HtmlPreviewer,
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "../IdentityOrAddr";
import { prettyHTML } from "../../utils/viewfuncs";
import RichTextStyleWrapper from "../content/richTextStyleWrapper";
import CommentActions from "../actions/commentActions";
import copy from "copy-to-clipboard";
import useDuration from "../../utils/hooks/useDuration";
import { useUser } from "../../context/user";
import useCommentsAnchor from "../../utils/hooks/useCommentsAnchor";
import Divider from "next-common/components/styled/layout/divider";
import clsx from "clsx";

const Wrapper = styled.div`
  position: relative;

  :hover {
    .edit {
      display: block;
    }
  }
`;

const InfoWrapper = styled(Flex)`
  min-height: 28px;
  justify-content: space-between;
  flex-wrap: wrap;

  > :last-child {
    font-size: 14px;
    color: var(--textTertiary);
  }
`;

const ContentWrapper = styled(RichTextStyleWrapper)`
  margin: 8px 0 0 28px;
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: var(--textTertiary);
`;

const IndentWrapper = styled.div`
  margin: 16px 0 0 28px;
  ${(p) =>
    p.quoted &&
    css`
      padding-left: 16px;
      border-left: 3px solid var(--neutral300);
    `};
`;

const FoldButton = styled.button`
  color: var(--textSecondary);
  &:hover {
    color: var(--textPrimary);
    cursor: pointer;
  }
`;

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

export default function Item({
  data,
  replyToCommentId,
  isSecondLevel,
  updateTopLevelComment,
  scrollToTopLevelCommentBottom,
}) {
  const user = useUser();
  const dispatch = useDispatch();
  const ref = useRef();
  const refCommentTree = useRef();
  const [comment, setComment] = useState(data);
  useEffect(() => setComment(data), [data]);
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const isMounted = useIsMountedBool();
  const duration = useDuration(comment.createdAt);
  const { hasAnchor, anchor } = useCommentsAnchor();
  const [folded, setFolded] = useState(true);

  // Jump to comment when anchor is set
  useEffect(() => {
    if (!hasAnchor) {
      return;
    }

    setFolded(false);

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
      setComment(updatedComment);
    }
  }, []);

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
    <Wrapper
      ref={refCommentTree}
      id={comment.height}
      className={clsx(
        "group/comment-item first:mt-0",
        !isSecondLevel ? "mt-8" : "mt-4",
        highlight &&
          clsx(
            "bg-neutral200 -mx-12 px-12 py-4 !mt-4",
            "max-md:-mx-6 max-md:px-6",
            isSecondLevel && clsx("-ml-4 pl-4", "max-md:-ml-4 max-md:pl-4"),
          ),
      )}
    >
      <InfoWrapper>
        <User user={comment.author} />
        <div>{duration}</div>
      </InfoWrapper>
      {!isEdit && (
        <>
          <ContentWrapper ref={ref}>
            {comment.contentType === "markdown" && (
              <MarkdownPreviewer
                content={comment.content}
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
            {comment.createdAt !== comment.updatedAt && (
              <EditedLabel>Edited</EditedLabel>
            )}
          </ContentWrapper>
          <div style={{ margin: "8px 0 0 28px" }}>
            <CommentActions
              setFolded={setFolded}
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
          </div>
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
      {comment.replies?.length > 0 && (
        <IndentWrapper quoted>
          <FoldButton
            className="text14Medium"
            onClick={() => {
              setFolded(!folded);
            }}
          >
            {folded ? `${comment.replies?.length} Replies` : "Hide Replies"}
          </FoldButton>

          {!folded
            ? (comment.replies || []).map((item) => (
                <Item
                  key={item._id}
                  data={item}
                  replyToCommentId={replyToCommentId}
                  isSecondLevel={true}
                  updateTopLevelComment={updateTopLevelComment || updateComment}
                  scrollToTopLevelCommentBottom={
                    scrollToTopLevelCommentBottom || scrollToCommentBottom
                  }
                />
              ))
            : null}
        </IndentWrapper>
      )}

      {!isSecondLevel && (
        <Divider
          className={clsx(
            "group-last/comment-item:hidden",
            "ml-7 relative top-4",
          )}
        />
      )}
    </Wrapper>
  );
}
