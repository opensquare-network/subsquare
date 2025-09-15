import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import WithPallet from "next-common/components/common/withPallet";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import { useMemo } from "react";

const FellowshipFinanceOverview = dynamicClientOnly(() => import("./finance"));
const FellowshipFeeds = dynamicClientOnly(() => import("./feeds"));
const FellowshipApplicationGuide = dynamicClientOnly(() =>
  import("./fellowshipApplicationGuide"),
);

export default function MultipleColumnCard() {
  const api = useContextApi();
  const [navCollapsed] = useNavCollapsed();

  const supportCheck = useMemo(() => {
    if (!api) {
      return null;
    }
    return {
      fellowshipCore: !isNil(api?.query?.fellowshipCore),
      fellowshipTreasury: !isNil(api?.query?.fellowshipTreasury),
      fellowshipSalary: !isNil(api?.query?.fellowshipSalary),
    };
  }, [api]);

  const showSingleColumn = useMemo(() => {
    if (!supportCheck) {
      return false;
    }
    return (
      !supportCheck.fellowshipCore ||
      !supportCheck.fellowshipTreasury ||
      !supportCheck.fellowshipSalary
    );
  }, [supportCheck]);

  if (!supportCheck) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex gap-4",
        navCollapsed ? "max-md:flex-col" : "max-lg:flex-col",
        showSingleColumn && "flex-col",
      )}
    >
      <div className="flex-1 flex flex-col">
        <FellowshipFeeds />
      </div>
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
