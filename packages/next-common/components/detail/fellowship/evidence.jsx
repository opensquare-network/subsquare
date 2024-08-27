import { SystemLink, SystemLoading, SystemWarning } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import ExternalLink from "next-common/components/externalLink";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import Tooltip from "next-common/components/tooltip";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useOnchainData } from "next-common/context/post";
import { useReferendumFellowshipCoreEvidence } from "next-common/context/post/fellowship/useReferendumFellowshipCoreEvidence";
import { useIpfsContent } from "next-common/hooks/useIpfsContent";
import { isHash } from "next-common/utils";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { hexToString } from "@polkadot/util";

function ContentLoading() {
  return (
    <div className="flex items-center justify-center gap-x-2 text-textTertiary text14Medium">
      <SystemLoading className="w-5 h-5" />
      Fetching...
    </div>
  );
}

function IpfsContent({ cid }) {
  const { value, loading, error } = useIpfsContent(cid);

  if (loading) {
    return <ContentLoading />;
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

function FellowshipReferendaDetailEvidenceImpl() {
  const { wish, evidence, loading } = useReferendumFellowshipCoreEvidence();
  const notFound = !wish && !evidence;

  let content;
  if (loading) {
    content = <ContentLoading />;
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

        <IpfsContent cid={cid} />
      </>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <hr className="my-4" />
      <h4 className="text14Bold text-textPrimary">
        Evidence{wish && ` for ${wish}`}
      </h4>

      {content}
    </div>
  );
}

export default function FellowshipReferendaDetailEvidence() {
  const pallet = useCoreFellowshipPallet();
  const onchainData = useOnchainData();
  const { call } = onchainData?.inlineCall || onchainData.proposal || {};

  if (
    call?.section === pallet &&
    ["promote", "approve"].includes(call?.method)
  ) {
    return <FellowshipReferendaDetailEvidenceImpl />;
  }

  return null;
}
