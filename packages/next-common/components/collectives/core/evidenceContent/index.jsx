import { SystemLink, SystemLoading, SystemWarning } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import { useIpfsContent } from "next-common/hooks/useIpfsContent";
import { cn, isHash } from "next-common/utils";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import { hexToString } from "@polkadot/util";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";

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
        <GreyPanel className="justify-center gap-x-2 text14Medium text-textPrimary py-2.5 px-4 max-w-full">
          <div className="line-clamp-1 break-all">{cid}</div>
          <Tooltip content="IPFS Link">
            <ExternalLink
              href={getIpfsLink(cid)}
              externalIcon={false}
              className="text-textTertiary hover:text-textSecondary"
            >
              <SystemLink className="w-4 h-4" />
            </ExternalLink>
          </Tooltip>
        </GreyPanel>

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
