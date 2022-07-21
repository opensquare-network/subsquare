import React from "react";
import styled, { css } from "styled-components";
import { timeDurationFromNow } from "next-common/utils";
import { useState } from "react";
import ThumbUpIcon from "next-common/assets/imgs/icons/thumb-up.svg";
import UnfoldIcon from "next-common/assets/imgs/icons/unfold.svg";
import FoldIcon from "next-common/assets/imgs/icons/fold.svg";
import User from "next-common/components/user";
import Flex from "next-common/components/styled/flex";
import {
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import { renderDisableNonAddressLink } from "next-common/utils/viewfuncs";

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
    background-color: #ebeef4;
  }

  :hover {
    .edit {
      display: block;
    }
  }

  ${(p) =>
    p.highlight &&
    css`
      background-color: #f6f7fa;
    `}
`;

const InfoWrapper = styled(Flex)`
  min-height: 28px;
  justify-content: space-between;
  flex-wrap: wrap;

  > :last-child {
    font-size: 14px;
    color: #9da9bb;
  }
`;

const ContentWrapper = styled.div`
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
        color: #506176;

        > svg {
          path {
            fill: #506176;
          }
        }
      }
    `}

  ${(p) =>
    p.highlight
      ? css`
          color: #506176;

          > svg {
            path {
              fill: #506176;
            }
          }
        `
      : css`
          color: #9da9bb;

          > svg {
            path {
              fill: #9da9bb;
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
  background: #f6f7fa;
  border-radius: 4px;
  margin: 10px 0 0 28px;
`;

const SupporterItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: #506176;
  }
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #9da9bb;
`;

export default function Item({ data, chain }) {
  const comment = data;
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  return (
    <Wrapper>
      <InfoWrapper>
        <User user={comment.author} chain={chain} />
        <div>{timeDurationFromNow(comment.createdAt)}</div>
      </InfoWrapper>
      <ContentWrapper>
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
        {comment.createdAt !== comment.updatedAt && (
          <EditedLabel>Edited</EditedLabel>
        )}
      </ContentWrapper>
      <ActionWrapper>
        <ActionItem
          noHover={!isLoggedIn || ownComment}
          highlight={isLoggedIn && thumbUp}
          onClick={toggleThumbUp}
        >
          <ThumbUpIcon />
          <div>Up ({comment?.reactions?.length ?? 0})</div>
        </ActionItem>
        {comment?.reactions?.length > 0 && (
          <UnfoldWrapper
            onClick={() => setShowThumbsUpList(!showThumbsUpList)}
          >
            {showThumbsUpList ? <UnfoldIcon /> : <FoldIcon />}
          </UnfoldWrapper>
        )}
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
    </Wrapper>
  );
}
