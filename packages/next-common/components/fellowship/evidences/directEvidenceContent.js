import { MarkdownPreviewer } from "@osn/previewer";
import { IpfsEvidenceContent } from "next-common/components/collectives/core/evidenceContent";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";

export default function DirectEvidenceContent({ content, cid, hex }) {
  if (content) {
    return <MarkdownPreviewer content={content} />;
  }

  if (cid) {
    return <IpfsEvidenceContent cid={cid} />;
  }

  if (hex) {
    const cid = getCidByEvidence(hex);
    return <IpfsEvidenceContent cid={cid} />;
  }

  return null;
}
