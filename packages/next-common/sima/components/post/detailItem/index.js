import ArticleContent from "./articleContent";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import DetailHeader from "next-common/components/detail/detailHeader";

export default function DetailItem() {
  const post = usePost();

  if (!post) {
    return null;
  }

  return (
    <DetailContentBase>
      <DetailHeader />
      <ArticleContent className="mt-6" />
    </DetailContentBase>
  );
}
