import ArticleContent from "./articleContent";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";

export default function DetailItem({ postReactions }) {
  const post = usePost();

  if (!post) {
    return null;
  }

  return (
    <DetailContentBase>
      <ArticleContent post={post} postReactions={postReactions} />
    </DetailContentBase>
  );
}
