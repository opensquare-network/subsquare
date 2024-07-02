const { createContext, useContext } = require("react");

const ArticleActionsContext = createContext({});

export default ArticleActionsContext;

export function useArticleActions() {
  return useContext(ArticleActionsContext);
}
