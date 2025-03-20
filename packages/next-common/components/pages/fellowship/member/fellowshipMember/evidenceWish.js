import Popup from "next-common/components/popup/wrapper/Popup";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import FellowshipRank from "next-common/components/fellowship/rank";
import { AddressUser } from "next-common/components/user";
import Divider from "next-common/components/styled/layout/divider";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import { usePageProps } from "next-common/context/page";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import CoretimeSalePanelChartSkeleton from "next-common/components/coretime/salePanel/chart/skeleton";
import Button from "next-common/lib/button";
import { useState } from "react";
import WishDetail from "next-common/components/pages/fellowship/member/fellowshipMember/wishDetail";
import { cn } from "next-common/utils";
import { useTheme } from "styled-components";
import { IpfsEvidenceRawContent } from "next-common/components/collectives/core/evidenceContent";
import {
  CoreFellowshipMemberRelatedReferendaContent,
  useFellowshipCoreRelatedReferenda,
} from "next-common/components/collectives/core/member/relatedReferenda";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import { useIpfsContent } from "next-common/hooks/useIpfsContent";

export default function EvidenceWish() {
  const { id: address, fellowshipMembers } = usePageProps();
  const { loading, wish, evidence } = useSubCoreFellowshipEvidence(address);

  const activeMember = fellowshipMembers.find(
    (member) => member.address === address,
  );
  return (
    <SecondaryCard>
      {loading ? (
        <OnchainEvidenceLoading />
      ) : (
        <BlockEvidenceOrEmpty
          wish={wish}
          evidence={evidence}
          address={address}
          activeMember={activeMember}
        />
      )}
    </SecondaryCard>
  );
}

function BlockEvidenceOrEmpty({ wish, evidence, address, activeMember }) {
  return wish && evidence ? (
    <>
      <OnchainEvidenceRetentionBar
        activeMember={activeMember}
        address={address}
      />
      <OnchainEvidenceStatisticsInfoImpl wish={wish} address={address} />
      <OnchainEvidenceContent evidence={evidence} wish={wish} />
    </>
  ) : (
    <NoEvidence />
  );
}

function OnchainEvidenceStatisticsInfoImpl({ wish, address }) {
  const { relatedReferenda, isLoading } =
    useFellowshipCoreRelatedReferenda(address);

  return (
    <SummaryLayout className="mt-4">
      <SummaryItem title="Wish">
        <LoadableContent>{wish}</LoadableContent>
      </SummaryItem>
      <SummaryItem title="Related Referendum">
        <LoadableContent>
          <CoreFellowshipMemberRelatedReferendaContent
            relatedReferenda={relatedReferenda}
            isLoading={isLoading}
          />
        </LoadableContent>
      </SummaryItem>
      {/* <SummaryItem title="My Votes">
        <LoadableContent>-</LoadableContent>
      </SummaryItem> */}
    </SummaryLayout>
  );
}

function OnchainEvidenceRetentionBar({ activeMember, address }) {
  return (
    <GreyPanel className="px-4 py-[0.675rem] flex items-center justify-center">
      <AddressUser add={address} />
      <span className="text14Medium text-textSecondary inline-block mx-2 whitespace-nowrap">
        is wishing for retention at
      </span>
      <FellowshipRank rank={activeMember?.rank} />
    </GreyPanel>
  );
}

function OnchainEvidenceContent({ evidence, wish }) {
  const [detailVisible, setDetailVisible] = useState(false);
  const { isDark } = useTheme();

  const cid = getCidByEvidence(evidence);
  const { value: ifpsContent, loading, error } = useIpfsContent(cid);

  return (
    <>
      <Divider className="mt-4" />
      <CardTitle className="mt-4">Evidence</CardTitle>

      <GreyPanel
        className={cn(
          "flex relative h-12 overflow-hidden after:h-28  after:hidden after:bg-gradient-to-b after:from-[rgba(246,247,250,0)] after:via-[rgba(246,247,250,0.8)] after:to-[#F6F7FA] after:absolute after:w-full after:bottom-0",
          {
            "after:bg-gradient-to-b after:from-[rgba(30,33,48,0.00)] after:via-[rgba(30,33,48,0.80)] after:to-[#1E2130]":
              isDark && !!ifpsContent,
          },
          {
            "h-60 after:block": !!ifpsContent,
          },
        )}
      >
        <div className="flex-1 absolute left-4 right-4 top-4">
          <IpfsEvidenceRawContent
            loading={loading}
            value={ifpsContent}
            error={error}
          />
        </div>
        <Button
          className={cn(
            "absolute top-4 right-4 bg-theme500 text-textPrimaryContrast hidden",
            { block: !!ifpsContent },
          )}
          size="small"
          onClick={() => setDetailVisible(true)}
        >
          View Evidence
        </Button>
        {detailVisible && (
          <WishDetailPopup
            onClose={() => setDetailVisible(false)}
            ifpsContent={ifpsContent}
            wish={wish}
          />
        )}
      </GreyPanel>
    </>
  );
}

function OnchainEvidenceLoading() {
  return (
    <>
      <CoretimeSalePanelChartSkeleton className="h-5" />
      <CoretimeSalePanelChartSkeleton className="h-5 mt-2" />
      <CoretimeSalePanelChartSkeleton className="h-5 w-1/2 mt-2" />
    </>
  );
}

function WishDetailPopup({ onClose, ifpsContent, wish }) {
  const { id: address, fellowshipMembers } = usePageProps();

  const activeMember = fellowshipMembers.find(
    (member) => member.address === address,
  );

  return (
    <Popup
      title={"Evidence For " + (wish || "")}
      className="w-[800px]"
      onClose={onClose}
    >
      <WishDetail
        address={address}
        activeMember={activeMember}
        ifpsContent={ifpsContent}
      />
    </Popup>
  );
}

function NoEvidence() {
  return (
    <div className="py-[16px] text-center">
      <span className="text14Medium text-textTertiary">No wish yet</span>
    </div>
  );
}
