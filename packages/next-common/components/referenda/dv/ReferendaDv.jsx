import ReferendaDvTabs from "next-common/components/referenda/dv/tabs";
import { TabsTitle } from "next-common/components/referenda/dv/common/styled";
import CountBySelect from "next-common/components/referenda/dv/common/countBySelect";
import ReferendaDvProvider from "next-common/context/referenda/dv";
import Prompt from "next-common/components/referenda/dv/prompt";
import { isNil } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import Cohorts from "./cohorts";
import { TabTitle } from "./common/delegatesTabTitle";

export default function ReferendaDv() {
  const { cohort } = usePageProps();

  if (isNil(cohort)) {
    return <OnlyShowCohortsHistory />;
  }

  return (
    <ReferendaDvProvider>
      <div className="gap-y-6 flex flex-col">
        <CountBySelect>
          <TabsTitle className="mx-0">Decentralized Voices</TabsTitle>
        </CountBySelect>
        <Prompt />
        <ReferendaDvTabs />
      </div>
    </ReferendaDvProvider>
  );
}

export function OnlyShowCohortsHistory() {
  const { cohorts = [] } = usePageProps();
  return (
    <>
      <TabTitle className="mx-6 mb-4" label="Cohorts" length={cohorts.length} />
      <Cohorts />
    </>
  );
}
