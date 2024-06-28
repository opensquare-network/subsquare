import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useProposalUpVote } from "next-common/sima/actions/upVote";
import { useProposalCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import { useReloadProposalPost } from "next-common/sima/actions/reloadPost";

export function ReferendaActionsContextProvider({ children }) {
  const upVote = useProposalUpVote();
  const cancelUpVote = useProposalCancelUpVote();
  const reloadPost = useReloadProposalPost();

  return (
    <ArticleActionsContext.Provider
      value={{ upVote, cancelUpVote, reloadPost }}
    >
      {children}
    </ArticleActionsContext.Provider>
  );
}
