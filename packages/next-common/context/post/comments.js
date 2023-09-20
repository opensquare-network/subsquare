import React, { useEffect } from "react";

const CommentsContext = React.createContext();

export default CommentsContext;

export function CommentsProvider({ children, comments: _comments }) {
  const [comments, setComments] = React.useState(_comments);
  useEffect(() => setComments(_comments), [_comments]);
  return (
    <CommentsContext.Provider value={{ comments, setComments }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const { comments } = React.useContext(CommentsContext);
  return comments;
}

export function useSetComments() {
  const { setComments } = React.useContext(CommentsContext);
  return setComments;
}
