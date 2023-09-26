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
import Divider from "next-common/components/styled/layout/divider";
import clsx from "clsx";

const Wrapper = styled.div`
  position: relative;
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
  color: var(--textSecondary);
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
    <Wrapper
      className={clsx(
        "group/comment-item first:mt-0",
        !isSecondLevel ? "mt-8" : "mt-4",
      )}
    >
      <InfoWrapper>
        <User
          user={comment.author}
          externalLink={comment?.author?.polkassemblyUserLink}
        />
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
            className="text14Medium"
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
