import DetailItem from "components/detailItem";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";
import { usePost } from "next-common/context/post";
import SimaPostDetail from "next-common/sima/components/post/postDetail";

function DetailContent() {
  return (
    <ContentWithComment>
      <DetailItem />
    </ContentWithComment>
  );
}

export default function PostDetail() {
  const post = usePost();

  if (post.dataSource === "sima") {
    return <SimaPostDetail />;
  }

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <DetailContent />
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}
