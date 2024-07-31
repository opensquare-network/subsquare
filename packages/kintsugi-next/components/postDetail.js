import { usePost } from "next-common/context/post";
import DetailItem from "components/detailItem";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import SimaPostDetail from "next-common/sima/components/post/postDetail";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";

export default function PostDetail() {
  const post = usePost();

  if (post.dataSource === "sima") {
    return <SimaPostDetail />;
  }

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <ContentWithComment>
          <DetailItem />
        </ContentWithComment>
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}
