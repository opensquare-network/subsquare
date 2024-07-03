import { DiscussionArticleActionsProvider } from "./context/articleActionsProvider";
import { DiscussionCommentActionsProvider } from "./context/commentActionsProvider";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import DetailItem from "./detailItem";

export default function SimaPostDetail() {
  return (
    <DiscussionCommentActionsProvider>
      <DiscussionArticleActionsProvider>
        <ContentWithComment>
          <DetailItem />
        </ContentWithComment>
      </DiscussionArticleActionsProvider>
    </DiscussionCommentActionsProvider>
  );
}
