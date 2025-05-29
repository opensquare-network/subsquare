import { SystemLoading, SystemWarning } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import { useIpfsContent } from "next-common/hooks/useIpfsContent";
import { cn, isHash } from "next-common/utils";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import { hexToString } from "@polkadot/util";
import EvidenceExternalLinkWithWish from "next-common/components/collectives/core/evidenceContent/EvidenceExternalLinkWithWish";

export default function FellowshipEvidenceContent({
  loading,
  wish,
  evidence,
  className = "",
}) {
  const notFound = !wish && !evidence;

  let content;

  if (loading) {
    content = <LoadingContent />;
  } else if (notFound) {
    content = (
      <WarningInfoPanel className="justify-center">
        <SystemWarning className="w-5 h-5" />
        {"Warning: can't find evidence on chain."}
      </WarningInfoPanel>
    );
  } else if (!isHash(evidence)) {
    content = <MarkdownPreviewer content={hexToString(evidence)} />;
  } else {
    const cid = getCidByEvidence(evidence);

    content = (
      <>
        <EvidenceExternalLinkWithWish cid={cid} wish={wish} />
        <IpfsEvidenceContent cid={cid} />
      </>
    );
  }

  return <div className={cn("space-y-4", className)}>{content}</div>;
}

function LoadingContent() {
  return (
    <div className="flex items-center justify-center gap-x-2 text-textTertiary text14Medium">
      <SystemLoading className="w-5 h-5" />
      Fetching...
    </div>
  );
}

function IpfsEvidenceContent({ cid }) {
  const { value, loading, error } = useIpfsContent(cid);

  return (
    <IpfsEvidenceRawContent value={value} loading={loading} error={error} />
  );
}

export function IpfsEvidenceRawContent({ value, loading, error }) {
  if (loading) {
    return <LoadingContent />;
  }

  if (error) {
    return (
      <WarningInfoPanel className="justify-center">
        <SystemWarning className="w-5 h-5" />
        {"Warning: can't load the evidence content."}
      </WarningInfoPanel>
    );
  }

  return <MarkdownPreviewer content={value} />;
}
