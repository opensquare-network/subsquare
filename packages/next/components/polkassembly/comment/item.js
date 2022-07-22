import React from "react";
import styled, { css } from "styled-components";
import { timeDurationFromNow } from "next-common/utils";
import User from "next-common/components/user";
import Flex from "next-common/components/styled/flex";
import {
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import { renderDisableNonAddressLink } from "next-common/utils/viewfuncs";
import Actions from "../actions";

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
        background-color: #ebeef4;
      }
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

const IndentWrapper = styled.div`
  margin: 16px 0 0 28px;
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #9da9bb;
`;

export default function Item({ data, chain, isSecondLevel }) {
  const comment = data;

  return (
    <Wrapper isSecondLevel={isSecondLevel}>
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
      {!isSecondLevel && (
        <IndentWrapper>
          <Actions chain={chain} reactions={comment.reactions} />
        </IndentWrapper>
      )}
      {comment.replies?.length > 0 && (
        <IndentWrapper>
          {(comment.replies || []).map((item) => (
            <Item
              key={item.id}
              data={item}
              chain={chain}
              isSecondLevel={true}
            />
          ))}
        </IndentWrapper>
      )}
    </Wrapper>
  );
}
