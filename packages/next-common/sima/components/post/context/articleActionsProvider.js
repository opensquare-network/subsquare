import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useDiscussionUpVote } from "next-common/sima/actions/upVote";
import { useDiscussionCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import { useReloadOffChainPost } from "next-common/noSima/actions/reloadPost";
import { useAddDiscussionAppendant } from "next-common/sima/actions/appendant";

export function DiscussionArticleActionsProvider({ children }) {
  const upVote = useDiscussionUpVote();
  const cancelUpVote = useDiscussionCancelUpVote();
  const reloadPost = useReloadOffChainPost();
  const addAppendant = useAddDiscussionAppendant();

  return (
    <ArticleActionsContext.Provider
      value={{ upVote, cancelUpVote, addAppendant, reloadPost }}
    >
      {children}
    </ArticleActionsContext.Provider>
  );
}
