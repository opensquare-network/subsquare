import CurrentCohorts from "./currentCohorts";
import ReferendaDvTabsList, { TABS } from "./common/referendaDvTabsList";
import { useSearchParams } from "next/navigation";
import Cohorts from "./cohorts";

export default function ReferendaDvTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || TABS.DELEGATES;
  return (
    <>
      <div className="mx-6">
        <ReferendaDvTabsList />
      </div>
      {tab === TABS.DELEGATES && <CurrentCohorts />}
      {tab === TABS.COHORTS && <Cohorts />}
    </>
  );
}
