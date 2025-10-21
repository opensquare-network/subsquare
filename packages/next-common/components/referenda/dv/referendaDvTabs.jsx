import CurrentCohort from "./currentCohort";
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
      {tab === TABS.DELEGATES && <CurrentCohort />}
      {tab === TABS.COHORTS && <Cohorts />}
    </>
  );
}
