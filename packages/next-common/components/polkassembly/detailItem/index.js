import ArticleContent from "./articleContent";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import PostTitle from "next-common/components/detail/common/Title";
import Info from "next-common/components/styled/info";
import PostMetaBase from "next-common/components/detail/container/postMeta/metaBase";
import { SystemActivity } from "@osn/icons/subsquare";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";

export default function DetailItem({ postReactions }) {
  const post = usePost();
  const postUpdateTime = post?.updatedAt || post?.createdAt;
  const timeAgo = formatTimeAgo(postUpdateTime);

  if (!post) {
    return null;
  }

  return (
    <DetailContentBase
      title={<PostTitle />}
      meta={
        <PostMetaBase>
          <Info>
            <SystemActivity className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />

            <span>{timeAgo}</span>
          </Info>
          <Info>{`${post.commentsCount} Comments`}</Info>
        </PostMetaBase>
      }
    >
      <ArticleContent className="mt-6" postReactions={postReactions} />
    </DetailContentBase>
  );
}
