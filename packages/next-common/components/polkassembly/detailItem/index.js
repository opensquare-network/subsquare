import ArticleContent from "./articleContent";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import PostTitle from "next-common/components/detail/common/Title";
import Info from "next-common/components/styled/info";
import UpdateIcon from "next-common/assets/imgs/icons/line-chart.svg";
import useDuration from "next-common/utils/hooks/useDuration";
import PostMetaBase from "next-common/components/detail/container/postMeta/metaBase";

export default function DetailItem({ postReactions }) {
  const post = usePost();
  const postUpdateTime = post?.updatedAt || post?.createdAt;
  const duration = useDuration(postUpdateTime);

  if (!post) {
    return null;
  }

  return (
    <DetailContentBase
      title={<PostTitle />}
      meta={
        <PostMetaBase>
          <Info>
            <UpdateIcon />
            <span>{duration}</span>
          </Info>
          <Info>{`${post.commentsCount} Comments`}</Info>
        </PostMetaBase>
      }
    >
      <ArticleContent className="mt-6" postReactions={postReactions} />
    </DetailContentBase>
  );
}
