import styled from "styled-components";

import Author from "components/author";
import { timeDuration } from "utils";
import Markdown from "components/markdown";

const Wrapper = styled.div`
  padding: 16px 0;
  :not(:last-child) {
    border-bottom: 1px solid #ebeef4;
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
`;

const ActionItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #9da9bb;
  :not(:first-child) {
    margin-left: 16px;
  }
  > img {
    filter: invert(67%) sepia(11%) saturate(448%) hue-rotate(177deg)
      brightness(99%) contrast(86%);
    margin-right: 8px;
  }
`;

export default function Item({ data }) {
  return (
    <Wrapper>
      <InfoWrapper>
        <Author
          username={data.author?.username}
          emailMd5={data.author?.emailMd5}
          address={data.author?.addresses?.[0]?.address}
        />
        <div>{timeDuration(data.createdAt)}</div>
      </InfoWrapper>
      <ContentWrapper>
        {data.contentType === "markdown" && <Markdown md={data.content} />}
      </ContentWrapper>
      <ActionWrapper>
        <ActionItem>
          <img src="/imgs/icons/reply.svg" />
          <div>Reply</div>
        </ActionItem>
        <ActionItem>
          <img src="/imgs/icons/thumb-up.svg" />
          <div>Up (0)</div>
        </ActionItem>
      </ActionWrapper>
    </Wrapper>
  );
}
