import ArticleContent from "./articleContent";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import PostTitle from "next-common/components/detail/common/Title";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";
import { toPolkassemblyDiscussionAuthor } from "next-common/utils/viewfuncs/discussion/normalizePaListItem";
import { useChain } from "next-common/context/chain";
import Info from "next-common/components/styled/info";
import UpdateIcon from "next-common/assets/imgs/icons/line-chart.svg";
import useDuration from "next-common/utils/hooks/useDuration";

export default function DetailItem({ postReactions }) {
  const post = usePost();
  const postUpdateTime = post?.updatedAt || post?.createdAt;
  const duration = useDuration(postUpdateTime);
  const chain = useChain();

  if (!post) {
    return null;
  }

  return (
    <DetailContentBase
      title={<PostTitle />}
      meta={
        <div className="flex items-center justify-between flex-nowrap">
          <div className="flex items-center">
            <PolkassemblyUser
              user={toPolkassemblyDiscussionAuthor(post.author, chain)}
              fontSize={12}
            />
            <Info>
              <UpdateIcon />
              <span>{duration}</span>
            </Info>
            <Info>{`${post.commentsCount} Comments`}</Info>
          </div>
        </div>
      }
    >
      <ArticleContent postReactions={postReactions} />
    </DetailContentBase>
  );
}
