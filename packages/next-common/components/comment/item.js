import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import User from "next-common/components/user";
import EditInput from "next-common/components/editInput";
import { useRouter } from "next/router";
import Flex from "next-common/components/styled/flex";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import {
  MarkdownPreviewer,
  HtmlPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "../IdentityOrAddr";
import { prettyHTML } from "../../utils/viewfuncs";
import RichTextStyleWrapper from "../content/richTextStyleWrapper";
import CommentActions from "../actions/commentActions";
import copy from "copy-to-clipboard";
import useDuration from "../../utils/hooks/useDuration";
import { useUser } from "../../context/user";

const Wrapper = styled.div`
  position: relative;
  padding: 16px 48px;
  margin: 0 -48px;
  @media screen and (max-width: 768px) {
    padding: 16px 0;
    margin: 0;
  }

  :not(:last-child)::after {
    content: "";
    height: 1px;
    position: absolute;
    bottom: 0;
    left: 76px;
    width: calc(100% - 124px);
    @media screen and (max-width: 768px) {
      left: 28px;
      width: calc(100% - 28px);
    }
    background-color: ${(props) => props.theme.grey200Border};
  }

  :hover {
    .edit {
      display: block;
    }
  }

  ${(p) =>
    p.highlight &&
    css`
      background-color: ${(props) => props.theme.grey100Bg};
    `}
`;

const InfoWrapper = styled(Flex)`
  min-height: 28px;
  justify-content: space-between;
  flex-wrap: wrap;

  > :last-child {
    font-size: 14px;
    color: ${(props) => props.theme.textTertiary};
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
  color: ${(props) => props.theme.textTertiary};
`;

export default function Item({ data, onReply }) {
  const user = useUser();
  const dispatch = useDispatch();
  const router = useRouter();
  const ref = useRef();
  const [comment, setComment] = useState(data);
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const isMounted = useIsMountedBool();
  const duration = useDuration(comment.createdAt);

  useEffect(() => {
    if (window?.location?.hash === "") {
      return;
    }
    const height = parseInt(window.location.hash.substr(1));
    setHighlight(height === comment.height);
  }, [router, comment.height]);

  const commentId = comment._id;
  const isLoggedIn = !!user;
  const ownComment = isLoggedIn && comment.author?.username === user.username;
  const thumbUp =
    isLoggedIn &&
    comment?.reactions?.findIndex((r) => r.user?.username === user.username) >
      -1;

  const updateComment = async () => {
    const { result: updatedComment } = await nextApi.fetch(
      `comments/${comment._id}`
    );
    if (updatedComment) {
      setComment(updatedComment);
    }
  };

  const toggleThumbUp = async () => {
    if (isLoggedIn && !ownComment && !thumbUpLoading) {
      setThumbUpLoading(true);
      try {
        let result, error;

        if (thumbUp) {
          ({ result, error } = await nextApi.delete(
            `comments/${comment._id}/reaction`
          ));
        } else {
          ({ result, error } = await nextApi.put(
            `comments/${comment._id}/reaction`,
            { reaction: 1 }
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
    <Wrapper id={comment.height} highlight={highlight}>
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
              highlight={isLoggedIn && thumbUp}
              noHover={!isLoggedIn || ownComment}
              edit={ownComment}
              setIsEdit={setIsEdit}
              toggleThumbUp={toggleThumbUp}
              thumbUpLoading={thumbUpLoading}
              reactions={comment.reactions}
              onReply={() => {
                if (isLoggedIn && !ownComment) {
                  onReply(comment.author);
                }
              }}
              copy
              onCopy={() => {
                copy(
                  `${window.location.origin}${window.location.pathname}${window.location.search}#${comment.height}`
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
    </Wrapper>
  );
}
