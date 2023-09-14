import { EditorProvider } from "next-common/context/post/editor";
import useUniversalComments from "../universalComments";
import MotionDetail from "./motionDetail";

export default function MotionContent({ motion, comments }) {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: motion,
    comments,
  });

  motion.status = motion.state?.state;

  return (
    <EditorProvider focusEditor={focusEditor}>
      <MotionDetail />
      {CommentComponent}
    </EditorProvider>
  );
}
