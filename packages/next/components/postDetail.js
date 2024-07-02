import DetailItem from "components/detailItem";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import SimaPostDetail from "next-common/sima/components/post/postDetail";
import { OffChainArticleActionsContextProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsContextProvider } from "next-common/noSima/context/commentActionsProvider";
import { useChainSettings } from "next-common/context/chain";

export default function PostDetail() {
  const { sima } = useChainSettings();

  if (sima) {
    return <SimaPostDetail />;
  }

  return (
    <OffChainArticleActionsContextProvider>
      <OffChainCommentActionsContextProvider>
        <ContentWithComment>
          <DetailItem />
        </ContentWithComment>
      </OffChainCommentActionsContextProvider>
    </OffChainArticleActionsContextProvider>
  );
}
