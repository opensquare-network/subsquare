import { SystemLink, SystemLoading, SystemWarning } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import { find } from "lodash-es";
import ExternalLink from "next-common/components/externalLink";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import Tooltip from "next-common/components/tooltip";
import { usePost } from "next-common/context/post";
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

export default function FellowshipReferendaDetailEvidence() {
  const post = usePost();
  const callArgs = post.onchainData?.inlineCall?.call?.args;
  const who = find(callArgs, { name: "who" })?.value;

  const fellowshipEvidence = useSubCoreFellowshipEvidence(who);
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
        <GreyPanel className="justify-center text14Medium text-textPrimary py-2.5 px-4">
          {cid}
          <Tooltip content="IPFS Link" className="ml-2">
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
      <div className="text14Bold text-textPrimary">
        {fellowshipEvidence.wish && `${fellowshipEvidence.wish}/`}Evidence
      </div>

      {content}
    </div>
  );
}
