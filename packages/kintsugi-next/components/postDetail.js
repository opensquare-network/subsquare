import { usePost } from "next-common/context/post";
import DetailItem from "components/detailItem";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import SimaPostDetail from "next-common/components/sima/post/postDetail";

export default function PostDetail() {
  const post = usePost();

  if (post.dataSource === "sima") {
    return <SimaPostDetail />;
  }

  return (
    <ContentWithComment>
      <DetailItem />
    </ContentWithComment>
  );
}
