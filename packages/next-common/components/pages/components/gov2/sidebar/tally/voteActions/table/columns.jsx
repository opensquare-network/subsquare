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
    render: ({ who }) => <AddressUser key="user" add={who} link="/votes" />,
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
      <MobileRow label="Detail">
        <VoteDetailField
          data={data}
          type={type}
          className="w-full flex justify-between"
        />
      </MobileRow>
    ),
  },
  {
    render: ({ data, type, maxImpactVotes }) => (
      <MobileRow label="Impact">
        <ImpactVotesField
          data={data}
          type={type}
          maxImpactVotes={maxImpactVotes}
        />
      </MobileRow>
    ),
  },
];

export const desktopColumns = [
  {
    name: "Account",
    className: "w-[240px]",
    render: ({ who }) => <AddressUser key="user" add={who} link="/votes" />,
  },
  {
    name: "Action",
    className: "w-[176px] text-left",
    render: ({ type, indexer, data }) => (
      <ActionField type={type} indexer={indexer} data={data} />
    ),
  },
  {
    name: "Detail",
    className: "text-left",
    render: ({ data, type }) => <VoteDetailField data={data} type={type} />,
  },
  {
    name: "Impact",
    className: "w-[176px] text-right",
    sortable: true,
    render: ({ data, type, maxImpactVotes }) => (
      <ImpactVotesField
        data={data}
        type={type}
        maxImpactVotes={maxImpactVotes}
      />
    ),
  },
];
