import { usePost } from "next-common/context/post";
import MotionDetail from "./motionDetail";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";

export default function MotionContent() {
  const motion = usePost();

  // eslint-disable-next-line react-hooks/immutability
  motion.status = motion.state?.state;

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <ContentWithComment>
          <MotionDetail />
        </ContentWithComment>
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}
