import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import {
  SpendTag,
  TreasuryTag,
} from "next-common/components/tags/state/treasury";
import { PostTitleImpl } from "next-common/components/profile/votingHistory/common";

const ProposalTitleColumnsDef = {
  name: "Title",
  className: "flex-1 whitespace-nowrap overflow-hidden text-ellipsis pr-2",
  style: { textAlign: "left" },
  render: (proposal) => (
    <PostTitleImpl
      url={`/treasury/proposals/${proposal.proposalIndex}`}
      title={proposal.title}
      noLink={false}
      className="text14Medium flex items-center [&>a]:truncate [&>a]:max-w-full [&>a]:whitespace-nowrap"
      referendumIndex={proposal.proposalIndex}
    />
  ),
};

const SpendTitleColumnsDef = {
  name: "Title",
  className: "flex-1 whitespace-nowrap overflow-hidden text-ellipsis pr-2",
  style: { textAlign: "left" },
  render: (spend) => (
    <PostTitleImpl
      url={`/treasury/spends/${spend.index}`}
      title={spend.title}
      noLink={false}
      className="text14Medium flex items-center [&>a]:truncate [&>a]:max-w-full [&>a]:whitespace-nowrap"
      referendumIndex={spend.index}
    />
  ),
};

const RequestColumnsDef = {
  name: "Request",
  style: { textAlign: "right", width: "120px" },
  render: (proposal) => (
    <ValueDisplay
      value={toPrecision(proposal.fiatValue)}
      symbol=""
      prefix="$"
      className="text14Medium text-textPrimary"
    />
  ),
};

const ProposalStatusColumnsDef = {
  name: "Status",
  style: { textAlign: "right", width: "120px" },
  render: (proposal) => <TreasuryTag state={proposal.status} />,
};

const SpendStatusColumnsDef = {
  name: "Status",
  style: { textAlign: "right", width: "120px" },
  render: (spend) => <SpendTag state={spend.status} />,
};

export const proposalColumnsDef = [
  ProposalTitleColumnsDef,
  RequestColumnsDef,
  ProposalStatusColumnsDef,
];

export const spendColumnsDef = [
  SpendTitleColumnsDef,
  RequestColumnsDef,
  SpendStatusColumnsDef,
];
