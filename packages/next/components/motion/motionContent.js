import { usePost } from "next-common/context/post";
import MotionDetail from "./motionDetail";
import ContentWithUniversalComment from "components/details/contentWithUniversalComment";

export default function MotionContent() {
  const motion = usePost();

  motion.status = motion.state?.state;

  return (
    <ContentWithUniversalComment>
      <MotionDetail />
    </ContentWithUniversalComment>
  );
}
