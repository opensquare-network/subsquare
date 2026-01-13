import BaseLayout from "../baseLayout";

import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { useChainSettings } from "next-common/context/chain";
import { GeneralProxiesProvider } from "next-common/context/proxy";
import SimaEvidencesCommentActionsProvider from "next-common/context/fellowship/simaEvidencesCommentActionsProvider";
import EvidenceLayoutBreadcrumbs from "./evidenceLayoutBreadcrumbs";
import { SimaEvidencesArticleActionsProvider } from "next-common/context/fellowship/simaEvidencesArticleActionsProvider";

export default function EvidenceLayout({ seoInfo = {}, children }) {
  const { sima } = useChainSettings();

  let content = children;
  if (sima) {
    content = (
      <SimaEvidencesArticleActionsProvider>
        <SimaEvidencesCommentActionsProvider>
          <GeneralProxiesProvider>{children}</GeneralProxiesProvider>
        </SimaEvidencesCommentActionsProvider>
      </SimaEvidencesArticleActionsProvider>
    );
  }

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="max-sm:px-0 px-6">
        <div className="max-w-[856px] py-6 mx-auto w-full max-sm:px-0">
          <EvidenceLayoutBreadcrumbs />
          <SecondaryCardDetail className="max-sm:!p-6 !p-12 flex flex-col gap-y-12">
            {content}
          </SecondaryCardDetail>
        </div>
      </div>
    </BaseLayout>
  );
}
