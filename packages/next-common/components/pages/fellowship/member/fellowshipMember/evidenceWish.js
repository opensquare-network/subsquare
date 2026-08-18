import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import Divider from "next-common/components/styled/layout/divider";
import useFellowshipMemberEvidence from "next-common/hooks/collectives/useFellowshipMemberEvidence";
import { usePageProps } from "next-common/context/page";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { Skeleton } from "next-common/components/skeleton";
import { cn, isHash } from "next-common/utils";
import { hexToString } from "@polkadot/util";
import { IpfsEvidenceRawContent } from "next-common/components/collectives/core/evidenceContent";
import { CoreFellowshipMemberRelatedReferendaActionsContent } from "next-common/components/collectives/core/member/relatedReferenda";
import { useIpfsContent } from "next-common/hooks/useIpfsContent";
import { WishBar } from "./wishBar";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import EvidenceLink from "next-common/components/profile/fellowship/core/evidence/link";
import { useContextAddress } from "next-common/context/address";

export default function EvidenceWish() {
  const { id: address } = usePageProps();
  const {
    loading,
    wish,
    evidence,
    cid,
    rank,
    relatedReferenda,
    isReferendaLoading,
    content,
    hasServerContent,
  } = useFellowshipMemberEvidence(address);

  return (
    <SecondaryCard>
      {loading ? (
        <OnchainEvidenceLoading />
      ) : (
        <BlockEvidenceOrEmpty
          wish={wish}
          evidence={evidence}
          cid={cid}
          rank={rank}
          address={address}
          relatedReferenda={relatedReferenda}
          isReferendaLoading={isReferendaLoading}
          content={content}
          hasServerContent={hasServerContent}
        />
      )}
    </SecondaryCard>
  );
}

function BlockEvidenceOrEmpty({
  wish,
  evidence,
  cid,
  rank,
  address,
  relatedReferenda,
  isReferendaLoading,
  content,
  hasServerContent,
}) {
  return wish && evidence ? (
    <>
      <WishBar wish={wish} rank={rank} address={address} />
      <EvidenceStatisticsInfo
        wish={wish}
        address={address}
        relatedReferenda={relatedReferenda}
        isReferendaLoading={isReferendaLoading}
      />
      <EvidenceContent
        evidence={evidence}
        cid={cid}
        content={content}
        hasServerContent={hasServerContent}
      />
    </>
  ) : (
    <NoEvidence />
  );
}

function EvidenceStatisticsInfo({
  wish,
  address,
  relatedReferenda,
  isReferendaLoading,
}) {
  const pallet = useCoreFellowshipPallet();

  return (
    <SummaryLayout className="mt-4">
      <SummaryItem title="Wish">
        <LoadableContent>{wish}</LoadableContent>
      </SummaryItem>
      <SummaryItem title="Related Referendum">
        <LoadableContent>
          <CoreFellowshipMemberRelatedReferendaActionsContent
            pallet={pallet}
            who={address}
            relatedReferenda={relatedReferenda}
            isLoading={isReferendaLoading}
            size={20}
          />
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}

function EvidencePanel({ cid, address, value, loading = false, error = null }) {
  return (
    <>
      <Divider className="mt-4" />
      <CardTitle className="mt-4">Evidence</CardTitle>

      <GreyPanel
        className={cn(
          "flex relative h-12 overflow-hidden after:h-28 after:hidden after:bg-gradient-to-b after:from-transparent after:via-neutral200-80 after:to-neutral200 after:absolute after:w-full after:bottom-0",
          {
            "h-60 after:block": !!value,
          },
        )}
      >
        <div className="flex-1 absolute left-4 right-4 top-4">
          <IpfsEvidenceRawContent
            loading={loading}
            value={value}
            error={error}
          />
        </div>
        <EvidenceLink
          cid={cid}
          address={address}
          className={cn(
            "absolute top-4 right-4 bg-theme500 text-textPrimaryContrast hidden h-7 rounded-md text12Medium py-[5px] px-[11px]",
            { block: !!value },
          )}
          showTooltip={false}
        >
          View Evidence
        </EvidenceLink>
      </GreyPanel>
    </>
  );
}

function EvidenceContent({ evidence, cid, content, hasServerContent }) {
  const address = useContextAddress();
  const isInlineText = !isHash(evidence);

  if (isInlineText) {
    return (
      <EvidencePanel
        cid={cid}
        address={address}
        value={hexToString(evidence)}
      />
    );
  }

  return (
    <IpfsEvidenceContent
      cid={cid}
      address={address}
      content={content}
      hasServerContent={hasServerContent}
    />
  );
}

function IpfsEvidenceContent({ cid, address, content, hasServerContent }) {
  const { value: ipfsContent, loading, error } = useIpfsContent(cid);
  const displayContent = ipfsContent ?? content;

  return (
    <EvidencePanel
      cid={cid}
      address={address}
      value={displayContent}
      loading={loading && !hasServerContent}
      error={hasServerContent ? null : error}
    />
  );
}

function OnchainEvidenceLoading() {
  return (
    <>
      <Skeleton className="h-5" />
      <Skeleton className="h-5 mt-2" />
      <Skeleton className="h-5 w-1/2 mt-2" />
    </>
  );
}

function NoEvidence() {
  return (
    <div className="py-[16px] text-center">
      <span className="text14Medium text-textTertiary">No wish yet</span>
    </div>
  );
}
