import FellowshipRank from "next-common/components/fellowship/rank";
import { useNavCollapsed } from "next-common/context/nav";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import {
  FellowshipDemotionPeriodWithProgress,
  FellowshipPromotionPeriodWithProgress,
} from "next-common/components/collectives/members/periodWithProgress.jsx";
import {
  useCollectivesContext,
  useCollectivesSection,
  useCoreFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { CoreFellowshipMemberEvidenceContent } from "next-common/components/collectives/core/member/evidence";
import {
  CoreFellowshipMemberRelatedReferendaContent,
  useFellowshipCoreRelatedReferenda,
} from "next-common/components/collectives/core/member/relatedReferenda";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { MineTagOnListView } from "next-common/components/delegation/delegate/common/mineTag";
import CoreFellowshipMemberSalary from "next-common/components/collectives/core/member/salary";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { AvatarAndAddressInListView } from "next-common/components/collectives/core/member/avatarAndAddress";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import FieldLoading from "next-common/components/icons/fieldLoading";
import Tooltip from "next-common/components/tooltip";
import { ContainerRefProvider } from "next-common/context/containerRef";
import { isSameAddress } from "next-common/utils";
import NavigateToDetailButton from "next-common/components/navigateToDetailButton";
import { useRouter } from "next/router";

const rankColumn = {
  name: "Rank",
  width: 60,
};

const memberColumn = {
  name: "Member",
  className: "min-w-[140px]",
};

const salaryColumn = {
  name: "Salary",
  className: "text-right",
  width: 120,
};

const demotionPeriodColumn = {
  name: "Demotion Period",
  width: 140,
  className: "ml-[48px]",
};

const promotionPeriodColumn = {
  name: "Promotion Period",
  width: 140,
  className: "ml-[48px]",
};

const evidenceColumn = {
  name: "Evidence",
  width: 120,
  className: "ml-[48px]",
};

const actionsColumn = {
  name: "",
  width: 80,
  className: "text-right",
};

const collectivesMemberColumns = [
  rankColumn,
  memberColumn,
  salaryColumn,
  demotionPeriodColumn,
  promotionPeriodColumn,
  evidenceColumn,
  actionsColumn,
];

const collectivesCandidateColumns = [
  rankColumn,
  { name: "Candidate" },
  {
    name: "Offboard Timeout",
    width: 180,
  },
  evidenceColumn,
  actionsColumn,
];

function EvidenceAndReferenda({ member }) {
  const pallet = useCoreFellowshipPallet();
  const { address } = member;
  const { relatedReferenda, isLoading: isLoadingRelatedReferenda } =
    useFellowshipCoreRelatedReferenda(address, pallet);
  const {
    loading: isLoadingEvidence,
    wish,
    evidence,
  } = useSubCoreFellowshipEvidence(address, pallet);

  if (isLoadingEvidence || isLoadingRelatedReferenda) {
    return <FieldLoading />;
  }

  if (!evidence && !relatedReferenda?.length) {
    return <EmptyCol />;
  }

  return (
    <div className="flex flex-col text14Medium gap-[2px] max-sm:items-end">
      <div className="flex gap-2">
        {evidence && (
          <CoreFellowshipMemberEvidenceContent
            member={member}
            isLoading={isLoadingEvidence}
            wish={wish}
            evidence={evidence}
          />
        )}
      </div>
      {relatedReferenda?.length > 0 && (
        <div className="text14Medium">
          <CoreFellowshipMemberRelatedReferendaContent
            relatedReferenda={relatedReferenda}
            isLoading={isLoadingRelatedReferenda}
          />
        </div>
      )}
    </div>
  );
}

export function AddressCol({ address }) {
  const [navCollapsed] = useNavCollapsed();
  return <AddressUser maxWidth={navCollapsed ? 360 : 160} add={address} />;
}

export function EmptyCol() {
  return <span className="text-textTertiary">-</span>;
}

export function NonCoreMemberCol() {
  return (
    <Tooltip content="Not imported in the management system">
      <EmptyCol />
    </Tooltip>
  );
}

function NonCoreMemberAddressCol({ address }) {
  return (
    <div className="flex items-center ml-[24px]">
      <AddressCol address={address} />
    </div>
  );
}

function DetailButton({ address }) {
  const section = useCollectivesSection();
  const router = useRouter();
  return (
    <NavigateToDetailButton
      onClick={() => router.push(`/${section}/members/${address}`)}
    />
  );
}

function getCoreMemberRow({ idx, member, params, ActionsComponent }) {
  const { address, rank } = member;
  const { isActive } = member.status;
  const {
    demotionPeriod = [],
    minPromotionPeriod = [],
    offboardTimeout,
  } = params ?? {};

  const demotionBlocks =
    rank <= 0 ? offboardTimeout : demotionPeriod[rankToIndex(rank)];

  return [
    <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
    <AvatarAndAddressInListView
      key={`address-row-${idx}`}
      address={address}
      isActive={isActive}
    />,
    <CoreFellowshipMemberSalary key="salary" member={member} params={params} />,
    <FellowshipDemotionPeriodWithProgress
      key={`demotion-period-${idx}`}
      address={address}
      rank={rank}
      blocks={demotionBlocks}
    />,
    rank > 0 ? (
      <FellowshipPromotionPeriodWithProgress
        key={`min-promotion-period-${idx}`}
        address={address}
        rank={rank}
        blocks={minPromotionPeriod[rank] || 0}
      />
    ) : (
      <EmptyCol key={`min-promotion-period-${idx}`} />
    ),
    <EvidenceAndReferenda key="evidence" member={member} />,
    <div key="more" className="flex gap-[12px]">
      {ActionsComponent && <ActionsComponent member={member} params={params} />}
      <DetailButton address={address} />
    </div>,
  ];
}

function getCandidateRow({ idx, member, params, ActionsComponent }) {
  const { address, rank } = member;
  const { isActive } = member.status;
  const { offboardTimeout } = params ?? {};

  return [
    <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
    <AvatarAndAddressInListView
      key={`address-row-${idx}`}
      address={address}
      isActive={isActive}
    />,
    <FellowshipDemotionPeriodWithProgress
      key={`demotion-period-${idx}`}
      address={address}
      rank={rank}
      blocks={offboardTimeout}
    />,
    <EvidenceAndReferenda key="evidence" member={member} />,
    <div key="more" className="flex gap-[12px]">
      {ActionsComponent && <ActionsComponent member={member} params={params} />}
      <DetailButton address={address} />
    </div>,
  ];
}

function getNonCoreMemberRow({ idx, member }) {
  const { address, rank } = member;

  return [
    <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
    <NonCoreMemberAddressCol key={`address-row-${idx}`} address={address} />,
    <NonCoreMemberCol key="salary" />,
    <NonCoreMemberCol key={`demotion-period-${idx}`} />,
    <NonCoreMemberCol key={`min-promotion-period-${idx}`} />,
    <EvidenceAndReferenda key="evidence" member={member} />,
    <div key="more" />,
  ];
}

function getNonCandidateCoreMemberRow({ idx, member }) {
  const { address, rank } = member;

  return [
    <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
    <NonCoreMemberAddressCol key={`address-row-${idx}`} address={address} />,
    <NonCoreMemberCol key={`offboard-timeout-${idx}`} />,
    <EvidenceAndReferenda key="evidence" member={member} />,
    <div key="more" />,
  ];
}

function CollectivesMemberTable({
  members = [],
  isLoading = false,
  ActionsComponent,
  isCandidate,
}) {
  const dataListRef = useRef();
  const realAddress = useRealAddress();
  const { params = {} } = useCollectivesContext();

  const columns = isCandidate
    ? collectivesCandidateColumns
    : collectivesMemberColumns;

  const memberRows = useMemo(
    () =>
      (members || []).map((member, idx) => {
        const { address, isFellowshipCoreMember } = member;

        let row = [];

        if (isFellowshipCoreMember) {
          row = getCoreMemberRow({
            idx,
            member,
            params,
            ActionsComponent,
          });
        } else {
          row = getNonCoreMemberRow({ idx, member });
        }

        if (isSameAddress(address, realAddress)) {
          row.tag = <MineTagOnListView />;
        }

        return row;
      }),
    [members, params, realAddress, ActionsComponent],
  );

  const candidateRows = useMemo(() => {
    return members.map((member, idx) => {
      const { address, isFellowshipCoreMember } = member;

      let row = [];

      if (isFellowshipCoreMember) {
        row = getCandidateRow({ idx, member, params, ActionsComponent });
      } else {
        row = getNonCandidateCoreMemberRow({ idx, member });
      }

      if (isSameAddress(address, realAddress)) {
        row.tag = <MineTagOnListView />;
      }

      return row;
    });
  }, [members, realAddress, params, ActionsComponent]);

  const rows = isCandidate ? candidateRows : memberRows;

  return (
    <ContainerRefProvider containerRef={dataListRef}>
      <DataList
        ref={dataListRef}
        bordered
        columns={columns}
        noDataText="No Members"
        rows={rows}
        loading={isLoading}
      />
    </ContainerRefProvider>
  );
}

function FellowshipMemberListView({
  members: _members,
  isLoading: _isLoading = true,
  ActionsComponent,
  isCandidate = false,
}) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(_isLoading);
    setMembers(_members);
  }, [_members, _isLoading]);

  return (
    <CollectivesMemberTable
      members={members}
      isLoading={isLoading}
      ActionsComponent={ActionsComponent}
      isCandidate={isCandidate}
    />
  );
}

export default memo(FellowshipMemberListView);
