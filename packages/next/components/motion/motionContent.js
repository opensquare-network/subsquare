import { usePost } from "next-common/context/post";
import MotionDetail from "./motionDetail";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";

export default function MotionContent() {
  const motion = usePost();

  motion.status = motion.state?.state;

  return (
    <ContentWithComment>
      <MotionDetail />
    </ContentWithComment>
  );
}
