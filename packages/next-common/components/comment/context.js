import React from "react";

const CommentContext = React.createContext();

export default CommentContext;

export function CommentProvider({ comment, children }) {
  return (
    <CommentContext.Provider value={comment}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComment() {
  return React.useContext(CommentContext);
}
