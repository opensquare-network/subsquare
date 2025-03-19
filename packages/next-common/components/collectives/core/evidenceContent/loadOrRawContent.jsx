import { SystemLoading, SystemWarning } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import { useIpfsContent } from "next-common/hooks/useIpfsContent";
import { cn, isHash } from "next-common/utils";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import { hexToString } from "@polkadot/util";
import { noop } from "lodash-es";
import { useEffect } from "react";

export default function FellowshipEvidenceContentLoadOrRawContent({
  loading,
  wish,
  evidence,
  className = "",
  onFetchStatusChange = noop,
  rawContent = "",
}) {
  const notFound = !wish && !evidence;

  let content;

  if (rawContent) {
    content = <MarkdownPreviewer content={rawContent} />;
  } else if (loading) {
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
      <IpfsEvidenceContent
        cid={cid}
        onFetchStatusChange={onFetchStatusChange}
      />
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

function IpfsEvidenceContent({ cid, onFetchStatusChange = noop }) {
  const { value, loading, error } = useIpfsContent(cid);

  useEffect(() => {
    onFetchStatusChange({
      value,
      loading,
      error,
    });
  }, [value, loading, error, onFetchStatusChange]);

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
