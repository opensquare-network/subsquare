import { createContext, useContext } from "react";

const ArticleActionsContext = createContext({});

export default ArticleActionsContext;

export function useArticleActions() {
  return useContext(ArticleActionsContext);
}
