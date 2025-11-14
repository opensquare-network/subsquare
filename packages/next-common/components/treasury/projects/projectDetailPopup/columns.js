import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { PostTitleImpl } from "next-common/components/profile/votingHistory/common";
import { usePriceType } from "../context/projectProvider";
import BigNumber from "bignumber.js";

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
  render: (proposal) => <RequestCol proposal={proposal} />,
};

export const proposalColumnsDef = [ProposalTitleColumnsDef, RequestColumnsDef];

export const spendColumnsDef = [SpendTitleColumnsDef, RequestColumnsDef];

function RequestCol({ proposal }) {
  const { priceType } = usePriceType();
  const proportion = proposal.proportion < 1 ? proposal.proportion * 100 : null;

  const value = BigNumber(proposal[priceType] ?? 0)
    .times(proposal.proportion)
    .toFixed(2);

  return (
    <ValueDisplay
      value={toPrecision(value)}
      symbol=""
      prefix="$"
      className="text14Medium text-textPrimary"
      tooltipOtherContent={proportion && `Project proportion: ${proportion}%`}
    />
  );
}
