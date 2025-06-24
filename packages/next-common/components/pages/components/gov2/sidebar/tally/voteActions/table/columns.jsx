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
    render: ({ type, indexer, data }) => (
      <MobileRow label="Action">
        <ActionField
          type={type}
          indexer={indexer}
          data={data}
          className="items-end"
        />
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
    width: 240,
    render: ({ who }) => <AddressUser key="user" add={who} />,
  },
  {
    name: "Action",
    width: 180,
    className: "text-left",
    render: ({ type, indexer, data }) => (
      <ActionField type={type} indexer={indexer} data={data} />
    ),
  },
  {
    name: "Detail",
    className: "text-left",
    width: 320,
    render: ({ data, type }) => <VoteDetailField data={data} type={type} />,
  },
  {
    name: "Impact",
    width: 176,
    className: "text-right",
    render: ({ data, type }) => <ImpactVotesField data={data} type={type} />,
  },
];
