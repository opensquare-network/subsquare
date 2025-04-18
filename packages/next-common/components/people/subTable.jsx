import DataList from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import AddressDisplay from "next-common/components/user/addressDisplay";
import useSubscribeMySubIdentities from "next-common/hooks/people/useSubscribeMySubIdentities";

const columns = [
  {
    name: "Identity", 
    width: 240,
  },
  {
    name: "Name",
    width: 240,
  },
  {
    name: "Address",
  },
];

export default function SubIdentitiesTable() {
  const { subs, isLoading } = useSubscribeMySubIdentities();

  return (
    <div className="flex flex-col gap-y-4">
      <DataList
        columns={columns}
        rows={(subs ?? []).map(([address, subName], index) => {
          return [
            <AddressUser key={`Identity-${index}`} add={address} />,
            <div
              key={`Name-${index}`}
              className="text-textPrimary text14Medium"
            >
              {subName}
            </div>,
            <div
              key={`Address-${index}`}
              className="text-textTertiary text14Medium"
            >
              <AddressDisplay address={address} />
            </div>,
          ];
        })}
        loading={isLoading}
        noDataText="No sub identities"
      />
    </div>
  );
}
