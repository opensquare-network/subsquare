import ContentWithComment from "./contentWithComment";
import { DiscussionActionsContextProvider } from "./context/articleActionsProvider";
import DetailItem from "./detailItem";

export default function SimaPostDetail() {
  return (
    <ContentWithComment>
      <DiscussionActionsContextProvider>
        <DetailItem />
      </DiscussionActionsContextProvider>
    </ContentWithComment>
  );
}
