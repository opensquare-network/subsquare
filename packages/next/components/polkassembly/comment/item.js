import React from "react";
import styled, { css } from "styled-components";
import User from "next-common/components/user";
import Flex from "next-common/components/styled/flex";
import {
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import Actions from "../actions";
import RichTextStyleWrapper from "next-common/components/content/richTextStyleWrapper";
import useDuration from "next-common/utils/hooks/useDuration";

const Wrapper = styled.div`
  position: relative;
  padding: 16px 48px;
  margin: 0 -48px;
  @media screen and (max-width: 768px) {
    padding: 16px 0;
    margin: 0;
  }

  ${(p) =>
    !p.isSecondLevel &&
    css`
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
        background-color: var(--neutral300);
      }
    `}
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
  all: unset;
  line-height: 20px;
  height: 28px;
  color: var(--textTertiary);
  &:hover {
    color: var(--textPrimary);
    cursor: pointer;
  }
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: var(--textTertiary);
`;

export default function Item({ data, isSecondLevel }) {
  const comment = data;

  const [folded, setFolded] = React.useState(true);
  const duration = useDuration(comment.createdAt);

  return (
    <Wrapper isSecondLevel={isSecondLevel}>
      <InfoWrapper>
        <User user={comment.author} noEvent />
        <div>{duration}</div>
      </InfoWrapper>
      <ContentWrapper>
        <MarkdownPreviewer
          content={comment.content}
          plugins={[renderMentionIdentityUserPlugin(<IdentityOrAddr />)]}
        />
        {comment.createdAt !== comment.updatedAt && (
          <EditedLabel>Edited</EditedLabel>
        )}
      </ContentWrapper>
      {!isSecondLevel && (
        <IndentWrapper>
          <Actions reactions={comment.reactions} />
        </IndentWrapper>
      )}
      {comment.replies?.length > 0 && (
        <IndentWrapper quoted>
          <FoldButton
            onClick={() => {
              setFolded(!folded);
            }}
          >
            {folded ? `${comment.replies?.length} Replies` : "Hide Replies"}
          </FoldButton>

          {!folded
            ? (comment.replies || []).map((item) => (
                <Item key={item.id} data={item} isSecondLevel={true} />
              ))
            : null}
        </IndentWrapper>
      )}
    </Wrapper>
  );
}
