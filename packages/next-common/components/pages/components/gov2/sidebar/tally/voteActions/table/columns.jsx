import AddressUser from "next-common/components/user/addressUser";
import { ImpactVotesField, VoteDetailField, ActionField } from "./fields";

export const columns = [
  {
    name: "Account",
    width: 224,
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
