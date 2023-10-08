import { usePost } from "next-common/context/post";
import PostTitle from "next-common/components/detail/common/Title";
import useDuration from "next-common/utils/hooks/useDuration";
import Flex from "next-common/components/styled/flex";
import styled from "styled-components";
import { toPolkassemblyDiscussionAuthor } from "next-common/utils/viewfuncs/discussion/normalizePaListItem";
import Info from "next-common/components/styled/info";
import UpdateIcon from "next-common/assets/imgs/icons/line-chart.svg";
import Divider from "next-common/components/styled/layout/divider";
import { useChain } from "next-common/context/chain";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: var(--textTertiary);
      margin: 0 8px;
    }
  }
`;

export default function PolkassemblyDetailHeader() {
  const post = usePost();
  const postUpdateTime = post?.updatedAt || post?.createdAt;
  const duration = useDuration(postUpdateTime);
  const chain = useChain();

  if (!post) {
    return null;
  }

  return (
    <>
      <PostTitle post={post} />
      <Divider className="my-4" />
      <div className="flex items-center justify-between flex-nowrap">
        <DividerWrapper>
          <PolkassemblyUser
            user={toPolkassemblyDiscussionAuthor(post.author, chain)}
            fontSize={12}
          />
          <Info>
            <UpdateIcon />
            <span>{duration}</span>
          </Info>
          <Info>{`${post.commentsCount} Comments`}</Info>
        </DividerWrapper>
      </div>
    </>
  );
}
