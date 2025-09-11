import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useDiscussionUpVote } from "next-common/sima/actions/upVote";
import { useDiscussionCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import { useReloadPost } from "next-common/noSima/actions/reloadPost";

export function DiscussionArticleActionsProvider({ children }) {
  const upVote = useDiscussionUpVote();
  const cancelUpVote = useDiscussionCancelUpVote();
  const reloadPost = useReloadPost();

  return (
    <ArticleActionsContext.Provider
      value={{ supportSima: true, upVote, cancelUpVote, reloadPost }}
    >
      {children}
    </ArticleActionsContext.Provider>
  );
}
