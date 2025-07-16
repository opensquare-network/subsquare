import BaseLayout from "./baseLayout";
import { usePageProps } from "next-common/context/page";
import { SecondaryCardDetail } from "../styled/containers/secondaryCard";
import { Breadcrumbs } from "./DetailLayout/breadcrumbs";
import { AddressUser } from "../user";
import { useChainSettings } from "next-common/context/chain";
import { GeneralProxiesProvider } from "next-common/context/proxy";
import SimaEvidencesCommentActionsProvider from "next-common/context/fellowship/simaEvidencesCommentActionsProvider";

export default function EvidenceLayout({ seoInfo = {}, children }) {
  const { who, detail } = usePageProps() || {};
  const { sima } = useChainSettings();
  const { indexer } = detail || {};
  const { blockHeight } = indexer || {};

  let content = children;
  if (sima) {
    content = (
      <SimaEvidencesCommentActionsProvider>
        <GeneralProxiesProvider>{children}</GeneralProxiesProvider>
      </SimaEvidencesCommentActionsProvider>
    );
  }

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="max-sm:px-0 px-6">
        <div className="max-w-[856px] py-6 mx-auto w-full max-sm:px-0">
          <Breadcrumbs
            breadcrumbs={[
              {
                path: "/fellowship/members",
                content: "Members",
              },
              {
                path: `/fellowship/members/${who}`,
                content: (
                  <AddressUser add={who} showAvatar={false} needHref={false} />
                ),
                className: "flex",
              },
              {
                content: `#${blockHeight}`,
              },
            ]}
          />
          <SecondaryCardDetail className="max-sm:!p-6 !p-12">
            {content}
          </SecondaryCardDetail>
        </div>
      </div>
    </BaseLayout>
  );
}
