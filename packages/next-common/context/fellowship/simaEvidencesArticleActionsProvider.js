import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useProvideContext } from "next-common/sima/actions/provideContext";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import {
  generalIndexer,
  generalBaseApiUrl,
} from "./simaEvidencesCommentActionsProvider";
import { backendApi } from "next-common/services/nextApi";

export function SimaEvidencesArticleActionsProvider({ children }) {
  const signSimaMessage = useSignSimaMessage();
  const provideContext = useProvideContext();

  const actions = {
    supportSima: true,
    provideContext,
    upVote: async (post) => {
      const indexer = generalIndexer(post);
      const entity = {
        indexer,
        action: "upvote",
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);

      return await backendApi.post(
        `${generalBaseApiUrl(post)}/reactions`,
        data,
      );
    },
    cancelUpVote: () => {},
    reloadPost: () => {},
    getUserDiscussions: () => {},
  };

  return (
    <ArticleActionsContext.Provider value={actions}>
      {children}
    </ArticleActionsContext.Provider>
  );
}
