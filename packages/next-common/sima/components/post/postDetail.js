import ContentWithComment from "./contentWithComment";
import { DiscussionActionsContextProvider } from "./context/articleActionsProvider";
import { DiscussionCommentActionsContextProvider } from "./context/commentActionsProvider";
import DetailItem from "./detailItem";

export default function SimaPostDetail() {
  return (
    <DiscussionCommentActionsContextProvider>
      <ContentWithComment>
        <DiscussionActionsContextProvider>
          <DetailItem />
        </DiscussionActionsContextProvider>
      </ContentWithComment>
    </DiscussionCommentActionsContextProvider>
  );
}
