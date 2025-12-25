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

export default function CuratorContent({ proposals, totalFiat }) {
  const { value: childBounties, loading: childBountiesLoading } =
    useAsync(async () => {
      const { result } = await backendApi.fetch(
        "treasury/child-bounties?simple=true&" +
          proposals.map((id) => "ids=" + id).join("&"),
      );
      if (!result) {
        return [];
      }
      return result.map((item) =>
        normalizeChildBountyListItem(process.env.NEXT_PUBLIC_CHAIN, item),
      );
    }, [proposals]);

  return (
    <>
      <CuratorSummary totalFiat={totalFiat} />
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
