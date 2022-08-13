import styled from "styled-components";
import { timeDurationFromNow } from "next-common/utils";
import User from "next-common/components/user";
import Flex from "next-common/components/styled/flex";
import ArticleContent from "./articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import UpdateIcon from "next-common/assets/imgs/icons/line-chart.svg";
import Info from "next-common/components/styled/info";
import { toPolkassemblyDiscussionAuthor } from "utils/viewfuncs";

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: ${(props) => props.theme.textTertiary};
      margin: 0 8px;
    }
  }
`;

const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
`;

const Title = styled.div`
  max-width: 750px;
  word-break: break-all;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  margin-bottom: 12px;
`;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  overflow: hidden;
  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 20px;
      line-height: 28px;
      color: ${(props) => props.theme.textTertiary};
      margin: 0 8px;
    }
  }
`;

const FlexWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

export default function DetailItem({ data, chain, type, postReactions }) {
  const post = data;

  if (!post) {
    return null;
  }

  return (
    <EditablePanel>
      <TitleWrapper>
        {post?.index !== undefined && <Index>{`#${post.index}`}</Index>}
        <Title>{post.title?.trim() || "--"}</Title>
      </TitleWrapper>
      <FlexWrapper>
        <DividerWrapper>
          <User user={toPolkassemblyDiscussionAuthor(post.author, chain)} chain={chain} fontSize={12} />
          <Info>
            <UpdateIcon />
            <span>{timeDurationFromNow(post.updatedAt || post.createdAt)}</span>
          </Info>
          <Info>{`${post.commentsCount} Comments`}</Info>
        </DividerWrapper>
      </FlexWrapper>
      <ArticleContent
        chain={chain}
        post={post}
        type={type}
        postReactions={postReactions}
      />
    </EditablePanel>
  );
}
