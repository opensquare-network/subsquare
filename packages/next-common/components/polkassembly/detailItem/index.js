import ArticleContent from "./articleContent";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import PolkassemblyDetailHeader from "../detailHeader";

export default function DetailItem({ postReactions }) {
  const post = usePost();

  if (!post) {
    return null;
  }

  return (
    <DetailContentBase>
      <PolkassemblyDetailHeader />
      <ArticleContent postReactions={postReactions} />
    </DetailContentBase>
  );
}
