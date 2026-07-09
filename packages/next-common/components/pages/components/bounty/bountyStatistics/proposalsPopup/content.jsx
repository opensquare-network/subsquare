import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next-common/components/link";
import { cn } from "next-common/utils";
import { childBountyColumnsDef } from "./columns";
import { useAsync } from "react-use";
import ItemsList from "./itemsList";
import { usePost } from "next-common/context/post";
import { AddressUser } from "next-common/components/user";
import { useChildBountiesFetcher } from "./context";

export function PostTitle({ url, index, title, noLink, className }) {
  return (
    <div className={cn("truncate max-w-[inherit] text-textPrimary", className)}>
      <span>{`#${index}`}</span>
      {noLink ? (
        <span>{title}</span>
      ) : (
        <Link href={url} title={title}>
          <span>{title}</span>
        </Link>
      )}
    </div>
  );
}

export default function PopupContent({ data, proposalOwner, role }) {
  const post = usePost();
  const parentBountyId = post.bountyIndex;
  const fetchChildBounties = useChildBountiesFetcher();

  const { value: childBounties, loading: childBountiesLoading } =
    useAsync(async () => {
      return fetchChildBounties(data, parentBountyId);
    }, [data, parentBountyId, fetchChildBounties]);

  return (
    <>
      <Summary
        totalFiat={data?.totalPayoutFiatValue || 0}
        role={role}
        proposalOwner={proposalOwner}
      />
      <ItemsList
        items={childBounties}
        loading={childBountiesLoading}
        columnsDef={childBountyColumnsDef}
        noDataText="No child bounties"
      />
    </>
  );
}

function Summary({ totalFiat, role, proposalOwner }) {
  return (
    <SummaryLayout>
      {proposalOwner && (
        <SummaryItem title={role} className="[&>div>div:last-child]:flex">
          <AddressUser add={proposalOwner} className="text14Bold" />
        </SummaryItem>
      )}
      <SummaryItem title="Total" className="[&>div>div:last-child]:flex">
        <ValueDisplay value={toPrecision(totalFiat)} symbol="" prefix="$" />
      </SummaryItem>
    </SummaryLayout>
  );
}
