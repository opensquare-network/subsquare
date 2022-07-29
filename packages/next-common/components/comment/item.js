import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { timeDurationFromNow } from "next-common/utils";
import Edit from "../edit";
import nextApi from "next-common/services/nextApi";
import ReplyIcon from "../../assets/imgs/icons/reply.svg";
import ThumbUpIcon from "../../assets/imgs/icons/thumb-up.svg";
import UnfoldIcon from "../../assets/imgs/icons/unfold.svg";
import FoldIcon from "../../assets/imgs/icons/fold.svg";
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
import { prettyHTML, renderDisableNonAddressLink } from "../../utils/viewfuncs";
import RichTextStyleWrapper from "../content/richTextStyleWrapper";

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

const ActionWrapper = styled(Flex)`
  margin: 16px 0 0 28px;
  align-items: flex-start;
  height: 22px;
  flex-wrap: wrap;
`;

const ActionItem = styled(Flex)`
  cursor: default;
  white-space: nowrap;

  ${(p) =>
    !p.noHover &&
    css`
      cursor: pointer;

      :hover {
        color: ${(props) => props.theme.textSecondary};

        > svg {
          path {
            fill: ${(props) => props.theme.textSecondary};
          }
        }
      }
    `}

  ${(p) =>
    p.highlight
      ? css`
          color: ${(props) => props.theme.textSecondary};

          > svg {
            path {
              fill: ${(props) => props.theme.textSecondary};
            }
          }
        `
      : css`
          color: ${(props) => props.theme.textTertiary};

          > svg {
            path {
              fill: ${(props) => props.theme.textTertiary};
            }
          }
        `}

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;

  :not(:first-child) {
    margin-left: 17px;
  }

  > svg {
    margin-right: 8px;
  }
  ${(props) =>
    props?.theme.isDark &&
    css`
      div {
        color: rgba(255, 255, 255, 0.25);
      }
    `};
`;

const UnfoldWrapper = styled(ActionItem)`
  margin-left: 7px !important;
`;

const SupporterWrapper = styled(Flex)`
  align-items: initial;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  margin: 10px 0 0 28px;
`;

const SupporterItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: ${(props) => props.theme.textSecondary};
  }
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: ${(props) => props.theme.textTertiary};
`;

export default function Item({ user, data, chain, onReply }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const ref = useRef();
  const [comment, setComment] = useState(data);
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);
  const isMounted = useIsMountedBool();

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
        <User user={comment.author} chain={chain} />
        <div>{timeDurationFromNow(comment.createdAt)}</div>
      </InfoWrapper>
      {!isEdit && (
        <>
          <ContentWrapper ref={ref}>
            {comment.contentType === "markdown" && (
              <MarkdownPreviewer
                content={comment.content}
                plugins={[
                  {
                    name: "disable-non-address-link",
                    onRenderedHtml: renderDisableNonAddressLink,
                  },
                  renderMentionIdentityUserPlugin(<IdentityOrAddr />),
                ]}
              />
            )}
            {comment.contentType === "html" && (
              <HtmlPreviewer
                content={prettyHTML(comment.content)}
                plugins={[
                  {
                    name: "disable-non-address-link",
                    onRenderedHtml: renderDisableNonAddressLink,
                  },
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
          <ActionWrapper>
            <ActionItem
              onClick={() => {
                if (isLoggedIn && !ownComment) {
                  onReply(comment.author);
                }
              }}
              noHover={!isLoggedIn || ownComment}
            >
              <ReplyIcon />
              <div>Reply</div>
            </ActionItem>
            <ActionItem
              noHover={!isLoggedIn || ownComment}
              highlight={isLoggedIn && thumbUp}
              onClick={toggleThumbUp}
            >
              <ThumbUpIcon />
              <div>
                Up
                {comment?.reactions?.length > 0
                  ? ` ${comment?.reactions?.length}`
                  : ``}
              </div>
            </ActionItem>
            {comment?.reactions?.length > 0 && (
              <UnfoldWrapper
                onClick={() => setShowThumbsUpList(!showThumbsUpList)}
              >
                {showThumbsUpList ? <UnfoldIcon /> : <FoldIcon />}
              </UnfoldWrapper>
            )}
            {ownComment && <Edit edit={ownComment} setIsEdit={setIsEdit} />}
          </ActionWrapper>
          {showThumbsUpList && comment?.reactions?.length > 0 && (
            <SupporterWrapper>
              {comment.reactions
                .filter((r) => r.user)
                .map((r, index) => (
                  <SupporterItem key={index}>
                    <User
                      user={r.user}
                      chain={chain}
                      showAvatar={false}
                      fontSize={12}
                    />
                  </SupporterItem>
                ))}
            </SupporterWrapper>
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
    </Wrapper>
  );
}
