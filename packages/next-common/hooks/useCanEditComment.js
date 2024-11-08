import { useComment } from "next-common/components/comment/context";
import useCanEditContent from "./useCanEditContent";

export default function useCanEditComment() {
  const comment = useComment();
  return useCanEditContent(comment);
}
