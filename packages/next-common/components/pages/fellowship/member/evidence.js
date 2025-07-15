import { IpfsEvidenceContent } from "next-common/components/collectives/core/evidenceContent";
import EvidenceLayout from "next-common/components/layout/evidenceLayout";
import { usePageProps } from "next-common/context/page";
import { WishBar } from "./fellowshipMember/wishBar";
import { MarkdownPreviewer } from "@osn/previewer";

export default function EvidencePage(props) {
  return (
    <EvidenceLayout
      seoInfo={{
        title: props.detail?.title,
        desc: props.detail?.title,
      }}
    >
      <EvidencePageImpl />
    </EvidenceLayout>
  );
}

function EvidencePageImpl() {
  const { detail } = usePageProps() || {};

  if (!detail) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-6">
      <WishBar wish={detail.wish} rank={detail.rank} address={detail.who} />
      <EvidenceContent />
    </div>
  );
}

function EvidenceContent() {
  const { detail } = usePageProps() || {};

  if (detail.content) {
    return <MarkdownPreviewer content={detail.content} />;
  } else if (detail.cid) {
    return <IpfsEvidenceContent cid={detail.cid} />;
  }

  return null;
}
