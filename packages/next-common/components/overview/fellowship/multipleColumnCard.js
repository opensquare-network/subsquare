import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import WithPallet from "next-common/components/common/withPallet";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

const FellowshipFinanceOverview = dynamicClientOnly(() => import("./finance"));
const FellowshipFeeds = dynamicClientOnly(() => import("./feeds"));
const FellowshipApplicationGuide = dynamicClientOnly(() =>
  import("./fellowshipApplicationGuide"),
);

export default function MultipleColumnCard() {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "flex gap-4",
        navCollapsed ? "max-md:flex-col" : "max-lg:flex-col",
      )}
    >
      <WithPallet pallet="fellowshipCore">
        <div className="flex-1">
          <FellowshipFeeds />
        </div>
      </WithPallet>
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <WithPallet pallet="fellowshipTreasury">
            <WithPallet pallet="fellowshipSalary">
              <FellowshipFinanceOverview />
            </WithPallet>
          </WithPallet>
        </div>

        <WithPallet pallet="fellowshipCore">
          <CollectivesProvider section="fellowship">
            <FellowshipApplicationGuide />
          </CollectivesProvider>
        </WithPallet>
      </div>
    </div>
  );
}
