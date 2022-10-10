import styled from "styled-components";
import User from "next-common/components/user";
import Flex from "next-common/components/styled/flex";
import ArticleContent from "./articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import UpdateIcon from "next-common/assets/imgs/icons/line-chart.svg";
import Info from "next-common/components/styled/info";
import { toPolkassemblyDiscussionAuthor } from "utils/viewfuncs";
import useDuration from "next-common/utils/hooks/useDuration";
import PostTitle from "next-common/components/detail/common/Title";
import { usePost } from "next-common/context/post";

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

const FlexWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

export default function DetailItem({ chain, type, postReactions }) {
  const post = usePost();
  const postUpdateTime = post?.updatedAt || post?.createdAt;
  const duration = useDuration(postUpdateTime);

  if (!post) {
    return null;
  }

  return (
    <EditablePanel>
      <PostTitle post={post}/>
      <FlexWrapper>
        <DividerWrapper>
          <User user={toPolkassemblyDiscussionAuthor(post.author, chain)} chain={chain} fontSize={12} />
          <Info>
            <UpdateIcon />
            <span>{duration}</span>
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
