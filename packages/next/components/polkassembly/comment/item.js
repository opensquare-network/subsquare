import React from "react";
import styled, { css } from "styled-components";
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
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";
import { LinkPolkassembly } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import { getPolkassemblyLink } from "next-common/utils/polkassembly";
import { useDetailType } from "next-common/context/page";
import { usePost } from "next-common/context/post";

const Wrapper = styled.div`
  position: relative;
`;

const InfoWrapper = styled(Flex)`
  min-height: 28px;
  justify-content: space-between;
  flex-wrap: wrap;
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
  const type = useDetailType();
  const post = usePost();

  return (
    <Wrapper
      className={clsx(
        "group/comment-item first:mt-0",
        !isSecondLevel ? "mt-8" : "mt-4",
      )}
    >
      <InfoWrapper>
        <PolkassemblyUser user={comment.author} />
        <div className="flex items-center gap-x-2">
          <p className="text12Medium text-textTertiary">{duration}</p>
          <Tooltip content="Post from Polkassembly">
            <ExternalLink
              href={`${getPolkassemblyLink(type, post)}#${data.id}`}
              externalIcon={false}
            >
              <LinkPolkassembly
                className={clsx(
                  "w-4 h-4",
                  "[&_path]:fill-textTertiary",
                  "[&_path]:hover:fill-textSecondary",
                )}
              />
            </ExternalLink>
          </Tooltip>
        </div>
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
