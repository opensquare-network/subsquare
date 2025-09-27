import React, { useEffect, useState } from "react";

const CommentContext = React.createContext();

export default CommentContext;

export function CommentProvider({ comment, children }) {
  const [_comment, setComment] = useState(comment);
  useEffect(() => {
    setComment(comment);
  }, [comment]);
  return (
    <CommentContext.Provider value={{ comment: _comment, setComment }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComment() {
  const { comment } = React.useContext(CommentContext);
  return comment;
}

export function useSetComment() {
  const { setComment } = React.useContext(CommentContext);
  return setComment;
}
