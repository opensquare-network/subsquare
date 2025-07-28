import SimaEvidencesCommentActionsProvider from "next-common/context/fellowship/simaEvidencesCommentActionsProvider";
import { useSwitchCommentTabs } from "next-common/context/post/switchComment";
import { GeneralProxiesProvider } from "next-common/context/proxy";
import { SimaProposalArticleActionsProvider } from "next-common/sima/components/common/context/articleActionsProvider";
import MaybeSimaContent from "./maybeSimaContent";

export default function SwitchCommentContentProvider({ children }) {
  const { activeTab } = useSwitchCommentTabs();

  if (activeTab === "evidence") {
    return (
      <SimaProposalArticleActionsProvider key="simaProposalArticleActionsProvider">
        <SimaEvidencesCommentActionsProvider>
          <GeneralProxiesProvider>{children}</GeneralProxiesProvider>
        </SimaEvidencesCommentActionsProvider>
      </SimaProposalArticleActionsProvider>
    );
  }

  return <MaybeSimaContent key="maybeSimaContent">{children}</MaybeSimaContent>;
}
