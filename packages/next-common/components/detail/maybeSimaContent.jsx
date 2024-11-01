import { useChainSettings } from "next-common/context/chain";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";
import { SimaProposalArticleActionsProvider } from "next-common/sima/components/common/context/articleActionsProvider";
import { SimaProposalCommentActionsProvider } from "next-common/sima/components/common/context/commentActionsProvider";

export default function MaybeSimaContent({ children }) {
  const { sima } = useChainSettings();

  if (sima) {
    return (
      <SimaProposalArticleActionsProvider>
        <SimaProposalCommentActionsProvider>
          {children}
        </SimaProposalCommentActionsProvider>
      </SimaProposalArticleActionsProvider>
    );
  }

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        {children}
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}
