import ValueDisplay from "next-common/components/valueDisplay";
import { PostTitleImpl } from "next-common/components/profile/votingHistory/common";

function createTitleColumnDef({ getIndex, getTitle, getDetailLink }) {
  return {
    name: "Title",
    className: "flex-1 whitespace-nowrap overflow-hidden text-ellipsis pr-2",
    style: { textAlign: "left" },
    render: (item) => {
      const detailLink = getDetailLink(item);
      const index = getIndex(item);
      const title = getTitle(item);
      return (
        <PostTitleImpl
          url={detailLink}
          title={title}
          noLink={false}
          className="text14Medium flex items-center [&>a]:truncate [&>a]:max-w-full [&>a]:whitespace-nowrap [&>a]:hover:underline"
          referendumIndex={index}
        />
      );
    },
  };
}

const ChildBountyTitleColumnsDef = createTitleColumnDef({
  getDetailLink: (childBounty) => childBounty.detailLink,
  getIndex: (childBounty) => childBounty.index,
  getTitle: (childBounty) => childBounty.title,
});

export const RequestColumnsDef = {
  name: "Payout",
  style: { textAlign: "right", width: "100px" },
  render: (item) => (
    <ValueDisplay
      value={item.payoutFiatValue}
      symbol=""
      prefix="$"
      className="text14Medium text-textPrimary"
    />
  ),
};

export const childBountyColumnsDef = [
  ChildBountyTitleColumnsDef,
  RequestColumnsDef,
];
