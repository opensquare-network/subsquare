import FellowshipRank from "next-common/components/fellowship/rank";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";
import { isNil } from "lodash-es";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";
import {
  FellowshipDemotionPeriodWithProgress,
  FellowshipPromotionPeriodWithProgress,
} from "next-common/components/collectives/members/periodWithProgress.jsx";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import Period from "next-common/components/fellowship/params/period";
import { CoreFellowshipMemberEvidenceContent } from "next-common/components/collectives/core/member/evidence";
import { CoreFellowshipMemberRelatedReferendaContent } from "next-common/components/collectives/core/member/relatedReferenda";

const collectivesMemberColumns = [
  {
    name: "Rank",
    width: 80,
  },
  {
    name: "Member",
    className: "",
  },
  {
    name: "Active Salary",
    width: 160,
    className: "text-right",
  },
  {
    name: "Passive Salary",
    width: 160,
    className: "text-right",
  },
  {
    name: "Demotion Period",
    width: 160,
    className: "ml-[64px]",
  },
  {
    name: "Min Promotion Period",
    width: 160,
    className: "ml-[64px]",
  },
  {
    name: "Evidence",
    width: 120,
    className: "ml-[64px]",
  },
  {
    name: "Referenda",
    width: 120,
    className: "ml-[64px]",
  },
];

export function AddressCol({ address }) {
  const [navCollapsed] = useNavCollapsed();
  return <AddressUser maxWidth={navCollapsed ? 360 : 160} add={address} />;
}

function CollectivesMemberTable({ members = [], isAllLoaded = true }) {
  const { params = {}, section } = useCollectivesContext();
  const {
    activeSalary = [],
    passiveSalary = [],
    demotionPeriod = [],
    minPromotionPeriod = [],
    offboardTimeout,
  } = params ?? {};
  const { symbol, decimals } = getSalaryAsset();

  const isLoading = isNil(members) || !isAllLoaded;

  const rows = (members || []).map((member, idx) => {
    const { address, rank } = member;
    const demotionBlocks =
      rank <= 0 ? offboardTimeout : demotionPeriod[rankToIndex(rank)];

    return [
      <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
      <AddressCol key={`address-row-${idx}`} address={address} />,
      <ValueDisplay
        key={`active-salary-${idx}`}
        value={toPrecision(getRankSalary(activeSalary, rank), decimals)}
        symbol={symbol}
      />,
      <ValueDisplay
        key={`passive-salary-${idx}`}
        value={toPrecision(getRankSalary(passiveSalary, rank), decimals)}
        symbol={symbol}
      />,
      section === "fellowship" ? (
        <FellowshipDemotionPeriodWithProgress
          key={`demotion-period-${idx}`}
          address={address}
          rank={rank}
          blocks={demotionBlocks}
        />
      ) : (
        <Period key={`demotion-period-${idx}`} blocks={demotionBlocks} />
      ),
      section === "fellowship" ? (
        <FellowshipPromotionPeriodWithProgress
          key={`min-promotion-period-${idx}`}
          address={address}
          rank={rank}
          blocks={minPromotionPeriod[rank] || 0}
        />
      ) : (
        <Period
          key={`min-promotion-period-${idx}`}
          blocks={minPromotionPeriod[rank] || 0}
        />
      ),
      <div key="evidence" className="flex flex-col text12Medium gap-[2px]">
        <CoreFellowshipMemberEvidenceContent
          member={member}
          pallet="fellowshipCore"
        />
      </div>,
      <CoreFellowshipMemberRelatedReferendaContent
        key="referenda"
        address={address}
        pallet="fellowshipCore"
      />,
    ];
  });

  return (
    <DataList
      bordered
      columns={collectivesMemberColumns}
      noDataText="No Members"
      rows={rows}
      loading={isLoading}
    />
  );
}

export default function FellowshipMemberListView({ members }) {
  // const params = useCoreFellowshipParams();

  return <CollectivesMemberTable members={members} isAllLoaded={true} />;
}
