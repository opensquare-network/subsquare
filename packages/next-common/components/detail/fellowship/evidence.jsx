import { SystemLink, SystemLoading, SystemWarning } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import { find } from "lodash-es";
import ExternalLink from "next-common/components/externalLink";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import Tooltip from "next-common/components/tooltip";
import { useOnchainData } from "next-common/context/post";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import { useIpfsContent } from "next-common/hooks/useIpfsContent";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";

function IpfsContent({ cid }) {
  const { value, loading, error } = useIpfsContent(cid);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-x-2 text-textTertiary text14Medium">
        <SystemLoading className="w-5 h-5" />
        Fetching...
      </div>
    );
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

function FellowshipReferendaDetailEvidenceImpl({ pallet, call }) {
  const who = find(call?.args, { name: "who" })?.value;

  const fellowshipEvidence = useSubCoreFellowshipEvidence(who, pallet);
  const notFound = !fellowshipEvidence.wish && !fellowshipEvidence.evidence;

  const cid = getCidByEvidence(fellowshipEvidence.evidence);

  const loading = fellowshipEvidence.loading;

  if (loading) {
    return null;
  }

  let content;
  if (notFound) {
    content = (
      <WarningInfoPanel className="justify-center">
        <SystemWarning className="w-5 h-5" />
        {"Warning: can't find the evidence on chain."}
      </WarningInfoPanel>
    );
  } else {
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

        <IpfsContent cid={cid} />
      </>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <hr className="my-4" />
      <h4 className="text14Bold text-textPrimary">
        Evidence{fellowshipEvidence.wish && ` for ${fellowshipEvidence.wish}`}
      </h4>

      {content}
    </div>
  );
}

export default function FellowshipReferendaDetailEvidence({
  pallet = "fellowshipCore",
}) {
  const onchainData = useOnchainData();
  const { call } = onchainData?.inlineCall || {};

  if (
    call?.section !== pallet &&
    (call?.method !== "promote" || call?.method !== "approve")
  ) {
    return null;
  }

  return <FellowshipReferendaDetailEvidenceImpl pallet={pallet} call={call} />;
}
