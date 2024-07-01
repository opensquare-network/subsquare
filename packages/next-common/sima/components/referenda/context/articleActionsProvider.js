import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useProposalUpVote } from "next-common/sima/actions/upVote";
import { useProposalCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import { useReloadProposalPost } from "next-common/sima/actions/reloadPost";
import { useProvideContext } from "next-common/sima/actions/provideContext";

export function ReferendaActionsContextProvider({ children }) {
  const upVote = useProposalUpVote();
  const cancelUpVote = useProposalCancelUpVote();
  const reloadPost = useReloadProposalPost();
  const provideContent = useProvideContext();

  return (
    <ArticleActionsContext.Provider
      value={{ provideContent, upVote, cancelUpVote, reloadPost }}
    >
      {children}
    </ArticleActionsContext.Provider>
  );
}
