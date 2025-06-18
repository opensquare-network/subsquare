import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import AllDelegation from "./allDelegation";

const TotalRequestingAssets = dynamicClientOnly(() =>
  import("next-common/components/totalRequestingAssets"),
);

export default function Gov2SummaryFooter() {
  return (
    <div className="flex flex-col w-full gap-y-4">
      <AllDelegation />
      <TotalRequestingAssets />
    </div>
  );
}
