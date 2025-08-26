import ReferendaDvTabs from "next-common/components/referenda/dv/referendaDvTabs";
import { TabsTitle } from "next-common/components/referenda/dv/common/styled";
import CountBySelect from "next-common/components/referenda/dv/common/countBySelect";
import DvDataTypeProvider from "next-common/context/referenda/dv";
import DvInfoPanel from "next-common/components/referenda/dv/dvInfoPanel";
import { isNil } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import Cohorts from "./cohorts";
import { TabTitle } from "./common/delegatesTabTitle";

export default function DecentralizedVoices() {
  const { cohort } = usePageProps();

  if (isNil(cohort)) {
    return <OnlyShowCohortsHistory />;
  }

  return (
    <DvDataTypeProvider>
      <div className="gap-y-4 flex flex-col">
        <CountBySelect>
          <TabsTitle className="mx-0">Decentralized Voices</TabsTitle>
        </CountBySelect>
        <DvInfoPanel />
        <ReferendaDvTabs />
      </div>
    </DvDataTypeProvider>
  );
}

function OnlyShowCohortsHistory() {
  const { cohorts = [] } = usePageProps();
  return (
    <>
      <TabTitle className="mx-6 mb-4" label="Cohorts" length={cohorts.length} />
      <Cohorts />
    </>
  );
}
