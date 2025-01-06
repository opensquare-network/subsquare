import FellowshipRank from "next-common/components/fellowship/rank";
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
import { CoreFellowshipMemberSalaryContent } from "next-common/components/collectives/core/member/salary";
import MoreActions from "./moreActions";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { MineTagOnListView } from "next-common/components/delegation/delegate/common/mineTag";
import Tooltip from "next-common/components/tooltip";

const collectivesMemberColumns = [
  {
    name: "Rank",
    width: 60,
  },
  {
    name: "Member",
    width: 140,
    className: "",
  },
  {
    name: "Salary",
    className: "text-right",
  },
  // {
  //   name: "Active Salary",
  //   width: 140,
  //   className: "text-right",
  // },
  // {
  //   name: "Passive Salary",
  //   width: 140,
  //   className: "text-right",
  // },
  {
    name: "Demotion Period",
    width: 140,
    className: "ml-[64px]",
  },
  {
    name: "Promotion Period",
    width: 140,
    className: "ml-[64px]",
  },
  {
    name: "Evidence",
    width: 120,
    className: "ml-[64px]",
  },
  {
    name: "",
    width: 80,
    className: "text-right",
  },
];

function Salary({ member, params }) {
  const { rank } = member;
  const { isActive } = member.status;

  const { activeSalary = [], passiveSalary = [] } = params ?? {};
  const { symbol, decimals } = getSalaryAsset();

  return (
    <Tooltip
      content={
        <div>
          <div className="flex gap-1">
            <span>Active Salary: </span>
            <span>
              {toPrecision(getRankSalary(activeSalary, rank), decimals)}
              &nbsp;{symbol}
            </span>
          </div>
          <div className="flex gap-1">
            <span>Passive Salary:</span>
            <span>
              {toPrecision(getRankSalary(passiveSalary, rank), decimals)}
              &nbsp;{symbol}
            </span>
          </div>
        </div>
      }
    >
      <CoreFellowshipMemberSalaryContent
        className="text14Medium"
        rank={rank}
        isActive={isActive}
        params={params}
      />
    </Tooltip>
  );
}

function EvidenceAndReferenda({ member }) {
  const { address } = member;

  return (
    <div className="flex flex-col text14Medium gap-[2px] max-sm:items-end">
      <div className="flex gap-2">
        <CoreFellowshipMemberEvidenceContent
          member={member}
          pallet="fellowshipCore"
        />
      </div>
      <div className="text14Medium">
        <CoreFellowshipMemberRelatedReferendaContent
          address={address}
          pallet="fellowshipCore"
        />
      </div>
    </div>
  );
}

export function AddressCol({ address }) {
  const [navCollapsed] = useNavCollapsed();
  return <AddressUser maxWidth={navCollapsed ? 360 : 160} add={address} />;
}

function CollectivesMemberTable({ members = [], isAllLoaded = true }) {
  const realAddress = useRealAddress();
  const { params = {}, section } = useCollectivesContext();
  const {
    demotionPeriod = [],
    minPromotionPeriod = [],
    offboardTimeout,
  } = params ?? {};

  const isLoading = isNil(members) || !isAllLoaded;

  const rows = (members || []).map((member, idx) => {
    const { address, rank } = member;

    const demotionBlocks =
      rank <= 0 ? offboardTimeout : demotionPeriod[rankToIndex(rank)];

    const row = [
      <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
      <AddressCol key={`address-row-${idx}`} address={address} />,
      <Salary key="salary" member={member} params={params} />,
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
      <EvidenceAndReferenda key="evidence" member={member} />,
      <div key="more">
        <MoreActions member={member} />
      </div>,
    ];

    if (address === realAddress) {
      row.tag = <MineTagOnListView />;
    }

    return row;
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
  return <CollectivesMemberTable members={members} isAllLoaded={true} />;
}
