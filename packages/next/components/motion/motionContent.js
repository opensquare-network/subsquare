import { usePost } from "next-common/context/post";
import MotionDetail from "./motionDetail";
import ContentWithUniversalComment from "components/details/contentWithUniversalComment";
import { usePageProps } from "next-common/context/page";

export default function MotionContent() {
  const motion = usePost();
  const { comments } = usePageProps();

  motion.status = motion.state?.state;

  return (
    <ContentWithUniversalComment comments={comments}>
      <MotionDetail />
    </ContentWithUniversalComment>
  );
}
