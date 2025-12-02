import ValueDisplay from "next-common/components/valueDisplay";
import { formatNum, toPrecision } from "next-common/utils";
import { PostTitleImpl } from "next-common/components/profile/votingHistory/common";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";

function createTitleColumnDef({ baseUrl, getIndex, getTitle }) {
  return {
    name: "Title",
    className: "flex-1 whitespace-nowrap overflow-hidden text-ellipsis pr-2",
    style: { textAlign: "left" },
    render: (item) => {
      const index = getIndex(item);
      const title = getTitle(item);
      return (
        <PostTitleImpl
          url={`${baseUrl}/${index}`}
          title={title}
          noLink={false}
          className="text14Medium flex items-center [&>a]:truncate [&>a]:max-w-full [&>a]:whitespace-nowrap [&>a]:hover:underline"
          referendumIndex={index}
        />
      );
    },
  };
}

const ProposalTitleColumnsDef = createTitleColumnDef({
  baseUrl: "/treasury/proposals",
  getIndex: (proposal) => proposal.proposalIndex,
  getTitle: (proposal) => proposal.title,
});

const SpendTitleColumnsDef = createTitleColumnDef({
  baseUrl: "/treasury/spends",
  getIndex: (spend) => spend.index,
  getTitle: (spend) => spend.title,
});

const ChildBountyTitleColumnsDef = createTitleColumnDef({
  baseUrl: "/treasury/child-bounties",
  getIndex: (childBounty) => childBounty.index,
  getTitle: (childBounty) => childBounty.title,
});

const TipTitleColumnsDef = {
  name: "Title",
  style: { textAlign: "left" },
  render: (item) => {
    return <Link href={`/treasury/tips/${item.hash}`}>{item.title}</Link>;
  },
};

const RequestColumnsDef = {
  name: "Request",
  style: { textAlign: "right", width: "100px" },
  render: (proposal) => <RequestCol proposal={proposal} />,
};

export const proposalColumnsDef = [ProposalTitleColumnsDef, RequestColumnsDef];

export const spendColumnsDef = [SpendTitleColumnsDef, RequestColumnsDef];

export const childBountyColumnsDef = [
  ChildBountyTitleColumnsDef,
  RequestColumnsDef,
];

export const tipColumnsDef = [TipTitleColumnsDef, RequestColumnsDef];

function RequestCol({ proposal }) {
  const proportion = proposal.proportion < 1 ? proposal.proportion * 100 : null;
  const totalValue = BigNumber(proposal.fiatAtFinal ?? 0);
  const value = totalValue.times(proposal.proportion).toFixed(2);

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
      content={`Total ${formatNum(totalValue)}, ${proportion.toFixed(
        2,
      )}%(${formatNum(value)}) fund`}
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
