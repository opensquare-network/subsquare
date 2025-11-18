import ValueDisplay from "next-common/components/valueDisplay";
import { formatNum, toPrecision } from "next-common/utils";
import { PostTitleImpl } from "next-common/components/profile/votingHistory/common";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useMemo } from "react";

const ProposalTitleColumnsDef = {
  name: "Title",
  className: "flex-1 whitespace-nowrap overflow-hidden text-ellipsis pr-2",
  style: { textAlign: "left" },
  render: (proposal) => (
    <PostTitleImpl
      url={`/treasury/proposals/${proposal.proposalIndex}`}
      title={proposal.title}
      noLink={false}
      className="text14Medium flex items-center [&>a]:truncate [&>a]:max-w-full [&>a]:whitespace-nowrap [&>a]:hover:underline"
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
      className="text14Medium flex items-center [&>a]:truncate [&>a]:max-w-full [&>a]:whitespace-nowrap [&>a]:hover:underline"
      referendumIndex={spend.index}
    />
  ),
};

const RequestColumnsDef = {
  name: "Request",
  style: { textAlign: "right", width: "100px" },
  render: (proposal) => <RequestCol proposal={proposal} />,
};

export const proposalColumnsDef = [ProposalTitleColumnsDef, RequestColumnsDef];

export const spendColumnsDef = [SpendTitleColumnsDef, RequestColumnsDef];

function RequestCol({ proposal }) {
  const proportion = proposal.proportion < 1 ? proposal.proportion * 100 : null;

  const totalValue = useMemo(() => {
    return BigNumber(proposal.fiatAtFinal ?? 0);
  }, [proposal]);

  const value = useMemo(() => {
    return totalValue.times(proposal.proportion).toFixed(2);
  }, [totalValue, proposal.proportion]);

  if (isNil(proportion)) {
    return (
      <ValueDisplay
        value={toPrecision(value)}
        symbol=""
        prefix="$"
        className="text14Medium text-textPrimary"
      />
    );
  }

  return (
    <Tooltip
      content={`Total ${formatNum(totalValue)}, ${proportion}%(${formatNum(
        value,
      )}) fund`}
    >
      <ValueDisplay
        value={toPrecision(value)}
        symbol=""
        prefix="$"
        className="text14Medium text-textPrimary"
        showTooltip={false}
      />
    </Tooltip>
  );
}
