const { createContext, useContext } = require("react");

const CommentActionsContext = createContext({});

export default CommentActionsContext;

export function useCommentActions() {
  return useContext(CommentActionsContext);
}
