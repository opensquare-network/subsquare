import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useDiscussionUpVote } from "next-common/sima/actions/upVote";
import { useDiscussionCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import { useReloadDiscussionPost } from "next-common/sima/actions/reloadPost";

export function DiscussionActionsContextProvider({ children }) {
  const upVote = useDiscussionUpVote();
  const cancelUpVote = useDiscussionCancelUpVote();
  const reloadPost = useReloadDiscussionPost();

  return (
    <ArticleActionsContext.Provider
      value={{ upVote, cancelUpVote, reloadPost }}
    >
      {children}
    </ArticleActionsContext.Provider>
  );
}
