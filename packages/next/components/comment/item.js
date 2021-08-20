import styled, { css } from "styled-components";

import Author from "components/author";
import {timeDuration} from "utils";
import Markdown from "components/markdown";
import Edit from "./edit";
import HtmlRender from "../post/htmlRender";
import nextApi from "services/nextApi";
import { useState } from "react";
import ReplyIcon from "public/imgs/icons/reply.svg"
import ThumbupIcon from "public/imgs/icons/thumb-up.svg"

const Wrapper = styled.div`
  padding: 16px 0;

  :not(:last-child) {
    border-bottom: 1px solid #ebeef4;
  }

  :hover {
    .edit {
      display: block;
    }
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  min-height: 28px;
  align-items: center;
  justify-content: space-between;

  > :last-child {
    color: #9da9bb;
  }
`;

const ContentWrapper = styled.div`
  margin: 8px 0 0 28px;
`;

const ActionWrapper = styled.div`
  display: flex;
  margin: 16px 0 0 28px;
  align-items: flex-start;
  height: 22px;
`;

const ActionItem = styled.div`
  ${p => !p.noHover && css`
    cursor: pointer;
    :hover {
      color: #506176;
      > svg {
        path {
          fill: #506176;
        }
      }
    }
  `}

  ${p => p.highlight ? css`
    color: #506176;
    > svg {
      path {
        fill: #506176;
      }
    }
  ` : css`
    color: #9da9bb;
    > svg {
      path {
        fill: #9da9bb;
      }
    }
  `}

  display: flex;
  align-items: center;
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
`;

const SupporterWrapper = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  background: #F6F7FA;
  border-radius: 4px;
  margin: 16px 0 0 28px;
`;

const SupporterTitle = styled.span`
  color: #9DA9BB;
  margin-right: 16px;
`;

const SupporterItem = styled.span`
  display: inline-block;
  color: #506176;
  margin-right: 12px;
`;

export default function Item({ user, data }) {
  const [comment, setComment] = useState(data);
  const [thumbupLoading, setThumbupLoading] = useState(false);

  const updateComment = async () => {
    const { result: updatedComment } = await nextApi.fetch(`comments/${comment._id}`);
    if (updatedComment) {
      setComment(updatedComment);
    }
  };

  const isLoggedIn = !!user;
  const ownComment = isLoggedIn && comment.author?.username === user.username;
  const thumbup = isLoggedIn && comment.reactions.findIndex(r => r.user?.username === user.username) > -1;

  const toggleThumbup = async () => {
    if (isLoggedIn && !ownComment && !thumbupLoading) {
      setThumbupLoading(true);
      try {
        if (thumbup) {
          await nextApi.fetch(`comments/${comment._id}/reaction`, {}, {
            method: "DELETE",
          });
        } else {
          await nextApi.fetch(`comments/${comment._id}/reaction`, {}, {
            method: "PUT",
            body: JSON.stringify({ reaction: 1 }),
            headers: { "Content-Type": "application/json" },
          });
        }
      } finally {
        setThumbupLoading(false);
      }

      await updateComment();
    }
  };

  return (
    <Wrapper>
      <InfoWrapper>
        <Author
          username={comment.author?.username}
          emailMd5={comment.author?.emailMd5}
          address={comment.author?.addresses?.[0]?.address}
        />
        <div>{timeDuration(comment.createdAt)}</div>
      </InfoWrapper>
      <ContentWrapper>
        {comment.contentType === "markdown" && <Markdown md={comment.content}/>}
        {comment.contentType === "html" && <HtmlRender html={comment.content}/>}
      </ContentWrapper>
      <ActionWrapper>
        <ActionItem noHover={!isLoggedIn || ownComment}>
          <ReplyIcon />
          <div>Reply</div>
        </ActionItem>
        <ActionItem
          noHover={!isLoggedIn || ownComment}
          highlight={isLoggedIn && thumbup}
          onClick={toggleThumbup}
        >
          <ThumbupIcon />
          <div>Up ({comment?.reactions?.length ?? 0})</div>
        </ActionItem>
        <Edit/>
      </ActionWrapper>
      {
        comment.reactions.length > 0 && (
          <SupporterWrapper>
            <SupporterTitle>Supported By</SupporterTitle>
            { comment.reactions.filter(r => r.user).map((r, index) => (
              <SupporterItem key={index}>{r.user.username}</SupporterItem>
            )) }
          </SupporterWrapper>
        )
      }
    </Wrapper>
  );
}
