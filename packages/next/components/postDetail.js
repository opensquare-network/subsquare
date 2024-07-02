import DetailItem from "components/detailItem";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { OffChainArticleActionsContextProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsContextProvider } from "next-common/noSima/context/commentActionsProvider";
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
    <OffChainArticleActionsContextProvider>
      <OffChainCommentActionsContextProvider>
        <DetailContent />
      </OffChainCommentActionsContextProvider>
    </OffChainArticleActionsContextProvider>
  );
}
