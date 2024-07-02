import { DiscussionActionsContextProvider } from "./context/articleActionsProvider";
import { DiscussionCommentActionsContextProvider } from "./context/commentActionsProvider";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import DetailItem from "./detailItem";

export default function SimaPostDetail() {
  return (
    <DiscussionCommentActionsContextProvider>
      <DiscussionActionsContextProvider>
        <ContentWithComment>
          <DetailItem />
        </ContentWithComment>
      </DiscussionActionsContextProvider>
    </DiscussionCommentActionsContextProvider>
  );
}
