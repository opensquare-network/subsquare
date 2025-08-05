import { MarkdownPreviewer } from "@osn/previewer";
import { isNil } from "lodash-es";
import { LoadingContent } from "next-common/components/collectives/core/evidenceContent";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { useAsync } from "react-use";
import EvidenceExternalLinkWithWish from "next-common/components/collectives/core/evidenceContent/EvidenceExternalLinkWithWish";
import EvidenceContentWithMemberStatusCard from "./evidenceContentWithMemberStatusCard";

function FellowshipEvidenceContentFromIpfs({ cid }) {
  const { value: content, loading } = useAsync(async () => {
    if (isNil(cid)) {
      return null;
    }
    return fetch(getIpfsLink(cid)).then((res) => res.text());
  });

  if (loading) {
    return <LoadingContent />;
  }

  if (isNil(content)) {
    return null;
  }

  return <MarkdownPreviewer content={content} />;
}

function EvidenceContentPreviewer({ evidence }) {
  if (evidence?.content) {
    return <MarkdownPreviewer content={evidence?.content} />;
  }

  return <FellowshipEvidenceContentFromIpfs cid={evidence?.cid} />;
}

export function FellowshipEvidenceContentFromApi({ evidence }) {
  return (
    <EvidenceContentWithMemberStatusCard>
      <EvidenceExternalLinkWithWish
        cid={evidence?.cid}
        wish={evidence?.wish}
        evidence={evidence?.hex}
      />
      <EvidenceContentPreviewer evidence={evidence} />
    </EvidenceContentWithMemberStatusCard>
  );
}
