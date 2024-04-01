import DataList from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipRank from "../../rank";
import { usePageProps } from "next-common/context/page";
import { find } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipSalaryMemberIsRegistered from "./isRegistered";
import Link from "next/link";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import FellowshipSalaryMemberStatus from "./status";

const columns = [
  {
    name: "Rank",
    width: 80,
  },
  {
    name: "Claimant",
    className: "min-w-[200px]",
  },
  {
    name: "isRegistered",
    className: "text-right",
    width: 160,
  },
  {
    name: "Last Active At",
    className: "text-right",
    width: 160,
  },
  {
    name: "Active Salary",
    className: "text-right",
    width: 160,
  },
  {
    name: "Passive Salary",
    className: "text-right",
    width: 160,
  },
  {
    name: "Status",
    className: "text-right",
    width: 160,
  },
];

export default function FellowshipSalaryClaimants() {
  const { fellowshipParams, fellowshipMembers, fellowshipSalaryClaimants } =
    usePageProps();

  const { activeSalary = [], passiveSalary = [] } = fellowshipParams ?? {};
  const { symbol, decimals } = useSalaryAsset();

  const rows = fellowshipSalaryClaimants?.map((claimant) => {
    const address = claimant?.address;
    const status = claimant?.status;
    const cycleIndex = status.lastActive;
    const member = find(fellowshipMembers, { address });
    const rank = member?.rank;

    return [
      <FellowshipRank key={`rank-${address}`} rank={rank} />,
      <AddressUser key={`address-${address}`} add={address} />,
      <FellowshipSalaryMemberIsRegistered
        key={`isRegistered-${address}`}
        status={status?.status}
      />,
      <Link
        key={`lastActive-${address}`}
        href={`/fellowship/salary/cycles/${cycleIndex}`}
        className="text14Medium text-theme500"
      >
        #{cycleIndex}
      </Link>,
      <ValueDisplay
        key={`active-salary-${address}`}
        value={toPrecision(activeSalary[rank - 1] || 0, decimals)}
        symbol={symbol}
      />,
      <ValueDisplay
        key={`passive-salary-${address}`}
        value={toPrecision(passiveSalary[rank - 1] || 0, decimals)}
        symbol={symbol}
      />,
      <FellowshipSalaryMemberStatus
        key={`status-${address}`}
        status={status?.status}
      />,
    ];
  });

  return (
    <div>
      <SecondaryCard>
        <DataList
          className="text14Medium"
          columns={columns}
          noDataText="No Claimants"
          rows={rows}
        />
      </SecondaryCard>
    </div>
  );
}
