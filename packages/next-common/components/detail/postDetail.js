import { usePost } from "next-common/context/post";
import DetailItem from "../polkassembly/detailItem";
import ContentWithComment from "./common/contentWithComment";
import SimaPostDetail from "../sima/post/postDetail";

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
