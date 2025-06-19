import AddressUser from "next-common/components/user/addressUser";
import { ImpactVotesField, VoteDetailField, ActionField } from "./fields";

function MobileRow({ label, children }) {
  return (
    <div className="flex flex-row justify-between">
      {label && <span className="text14Medium text-textTertiary">{label}</span>}
      {children}
    </div>
  );
}

export const mobileColumns = [
  {
    render: ({ who }) => <AddressUser key="user" add={who} />,
  },
  {
    render: ({ type, indexer }) => (
      <MobileRow label="Action">
        <ActionField type={type} indexer={indexer} className="items-end" />
      </MobileRow>
    ),
  },
  {
    render: ({ data, type }) => (
      <VoteDetailField
        data={data}
        type={type}
        className="w-full flex justify-between"
      />
    ),
  },
  {
    render: ({ data, type }) => (
      <MobileRow label="Impact">
        <ImpactVotesField data={data} type={type} />
      </MobileRow>
    ),
  },
];

export const desktopColumns = [
  {
    name: "Account",
    width: 264,
    render: ({ who }) => <AddressUser key="user" add={who} />,
  },
  {
    name: "Action",
    width: 200,
    className: "text-left",
    render: ({ type, indexer }) => (
      <ActionField type={type} indexer={indexer} />
    ),
  },
  {
    name: "Detail",
    width: 240,
    className: "text-left",
    render: ({ data, type }) => <VoteDetailField data={data} type={type} />,
  },
  {
    name: "Impact",
    width: 160,
    className: "text-right",
    render: ({ data, type }) => <ImpactVotesField data={data} type={type} />,
  },
];
