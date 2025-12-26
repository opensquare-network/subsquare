import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next-common/components/link";
import { cn } from "next-common/utils";
import normalizeChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import { childBountyColumnsDef } from "./columns";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import ItemsList from "./itemsList";
import { usePost } from "next-common/context/post";

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

export default function CuratorContent({ data }) {
  const post = usePost();
  const parentBountyId = post.bountyIndex;

  const { value: childBounties, loading: childBountiesLoading } =
    useAsync(async () => {
      if (!data?.childBounties?.length) {
        return [];
      }
      const { result } = await backendApi.fetch(
        "treasury/child-bounties?simple=true&" +
          data.childBounties
            .map((item) => "ids=" + `${parentBountyId}_${item.index}`)
            .join("&"),
      );
      if (!result) {
        return [];
      }
      return result.map((item) => {
        const payout =
          data?.childBounties?.find((payout) => payout.index === item.index) ||
          {};
        const normalizedChildBounty = normalizeChildBountyListItem(
          process.env.NEXT_PUBLIC_CHAIN,
          item,
        );
        return {
          ...normalizedChildBounty,
          ...payout,
        };
      });
    }, [data, parentBountyId]);

  return (
    <>
      <CuratorSummary totalFiat={data?.totalPayoutFiatValue || 0} />
      <ItemsList
        items={childBounties}
        loading={childBountiesLoading}
        columnsDef={childBountyColumnsDef}
        noDataText="No child bounties"
      />
    </>
  );
}

function CuratorSummary({ totalFiat }) {
  return (
    <SummaryLayout>
      <SummaryItem title="Total" className="[&>div>div:last-child]:flex">
        <ValueDisplay value={toPrecision(totalFiat)} symbol="" prefix="$" />
      </SummaryItem>
    </SummaryLayout>
  );
}
