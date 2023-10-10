import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import nextApi from "next-common/services/nextApi";
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
import useCommentsAnchor from "../../utils/hooks/useCommentsAnchor";
import Divider from "next-common/components/styled/layout/divider";
import clsx from "clsx";
import { useComments, useSetComments } from "next-common/context/post/comments";
import SystemUser from "../user/systemUser";
import { CommentProvider, useComment } from "./context";
import Duration from "../duration";

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

function Replies({
  folded,
  setFolded,
  replyToCommentId,
  updateTopLevelComment,
  scrollToTopLevelCommentBottom,
}) {
  const comment = useComment();
  const replies = comment.replies;

  return (
    <IndentWrapper quoted>
      <FoldButton
        className="text14Medium"
        onClick={() => {
          setFolded(!folded);
        }}
      >
        {folded ? `${replies?.length} Replies` : "Hide Replies"}
      </FoldButton>

      {!folded
        ? (replies || []).map((item) => (
            <Item
              key={item._id}
              data={item}
              replyToCommentId={replyToCommentId}
              isSecondLevel={true}
              updateTopLevelComment={updateTopLevelComment}
              scrollToTopLevelCommentBottom={scrollToTopLevelCommentBottom}
            />
          ))
        : null}
    </IndentWrapper>
  );
}

function CommentContentView({
  setIsEdit,
  replyToCommentId,
  setFolded,
  updateTopLevelComment,
  scrollToTopLevelCommentBottom,
}) {
  const comment = useComment();

  return (
    <>
      <ContentWrapper>
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
          updateComment={updateTopLevelComment}
          scrollToNewReplyComment={scrollToTopLevelCommentBottom}
          replyToCommentId={replyToCommentId}
          setIsEdit={setIsEdit}
        />
      </div>
    </>
  );
}

function ItemImpl({
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
  const [folded, setFolded] = useState(true);
  const comments = useComments();
  const setComments = useSetComments();

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
        <SystemUser user={comment.author} />
        <div>
          <Duration time={comment.createdAt} />
        </div>
      </InfoWrapper>
      {!isEdit && (
        <CommentContentView
          setIsEdit={setIsEdit}
          setFolded={setFolded}
          replyToCommentId={replyToCommentId}
          updateTopLevelComment={updateTopLevelComment || updateComment}
          scrollToTopLevelCommentBottom={
            scrollToTopLevelCommentBottom || scrollToCommentBottom
          }
        />
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
        <Replies
          folded={folded}
          setFolded={setFolded}
          replyToCommentId={replyToCommentId}
          updateTopLevelComment={updateTopLevelComment || updateComment}
          scrollToTopLevelCommentBottom={
            scrollToTopLevelCommentBottom || scrollToCommentBottom
          }
        />
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

export default function Item({ data, ...props }) {
  return (
    <CommentProvider comment={data}>
      <ItemImpl {...props} />
    </CommentProvider>
  );
}
