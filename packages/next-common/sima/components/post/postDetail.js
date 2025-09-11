import { DiscussionArticleActionsProvider } from "./context/articleActionsProvider";
import { DiscussionCommentActionsProvider } from "./context/commentActionsProvider";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import DetailItem from "./detailItem";
import { GeneralProxiesProvider } from "next-common/context/proxy";

export default function SimaPostDetail() {
  return (
    <DiscussionCommentActionsProvider>
      <DiscussionArticleActionsProvider>
        <GeneralProxiesProvider>
          <ContentWithComment>
            <DetailItem />
          </ContentWithComment>
        </GeneralProxiesProvider>
      </DiscussionArticleActionsProvider>
    </DiscussionCommentActionsProvider>
  );
}
