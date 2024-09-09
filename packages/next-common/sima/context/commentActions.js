import { createContext, useContext } from "react";

const CommentActionsContext = createContext({});

export default CommentActionsContext;

export function useCommentActions() {
  return useContext(CommentActionsContext);
}
