import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useOffChainProvideContext } from "../actions/provideContext";
import { useReloadOffChainPost } from "../actions/reloadPost";
import { useOffChainPostUpVote } from "../actions/upVote";
import { useOffChainPostCancelUpVote } from "../actions/cancelUpVote";

export function OffChainArticleActionsContextProvider({ children }) {
  const upVote = useOffChainPostUpVote();
  const cancelUpVote = useOffChainPostCancelUpVote();
  const reloadPost = useReloadOffChainPost();
  const provideContent = useOffChainProvideContext();

  return (
    <ArticleActionsContext.Provider
      value={{
        provideContent,
        reloadPost,
        upVote,
        cancelUpVote,
      }}
    >
      {children}
    </ArticleActionsContext.Provider>
  );
}
