import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import DataList from "next-common/components/dataList";
import { AddressUser } from "next-common/components/user";

export default function ReferendaDVsVotes() {
  const columns = [
    {
      name: "Account",
      style: { width: 240, textAlign: "left" },
    },
  ];

  const rows = [[<AddressUser key="account" add="" />]];

  return (
    <div className="flex flex-col gap-y-4">
      <DvVotesTitle />
      <NeutralPanel className="p-6">
        <DataList columns={columns} rows={rows} bordered={false} />
      </NeutralPanel>
    </div>
  );
}

function DvVotesTitle() {
  return <span className="text16Bold mx-6">DV Votes</span>;
}
