import MotionDetail from "./motionDetail";
import ContentWithUniversalComment from "components/details/contentWithUniversalComment";

export default function MotionContent({ motion, comments }) {
  motion.status = motion.state?.state;

  return (
    <ContentWithUniversalComment comments={comments}>
      <MotionDetail />
    </ContentWithUniversalComment>
  );
}
