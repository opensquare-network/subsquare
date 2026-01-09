import { useCallback, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProjectStatisticsSummary from "next-common/components/treasury/projects/statistics/summary";
import YearStatusBarChart from "./barChart";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useChain } from "next-common/context/chain";
import { isPolkadotChain } from "next-common/utils/chain";
import Loading from "next-common/components/loading";
import { useYearsDatasets } from "../hooks/useYearsDatasets";
import dynamicPopup from "next-common/lib/dynamic/popup";

const YearStatusDetailPopup = dynamicPopup(() => import("./detailPopup"));

function YearStatusImpl() {
  const { datasets, height, summaryTotalFiat, loading } = useYearsDatasets();
  const [showYearDetailPopup, setShowYearDetailPopup] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  const onYearClick = useCallback((year) => {
    setSelectedYear(year);
    setShowYearDetailPopup(true);
  }, []);

  const onYearClose = useCallback(() => {
    setShowYearDetailPopup(false);
    setSelectedYear(null);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <TitleContainer className="justify-start">
        <div className="text-textPrimary text14Bold">Year Status</div>
      </TitleContainer>
      <SecondaryCard className="[&>div:first-child]:mb-4">
        <ProjectStatisticsSummary totalFiat={summaryTotalFiat?.totalFiat} />
        <YearStatusBarChart
          data={datasets}
          height={height}
          onClick={onYearClick}
        />
      </SecondaryCard>
      {showYearDetailPopup && (
        <YearStatusDetailPopup
          selectedYear={selectedYear}
          onClose={onYearClose}
        />
      )}
    </>
  );
}

export default function YearStatus() {
  const chain = useChain();

  if (!isPolkadotChain(chain)) {
    return null;
  }

  return <YearStatusImpl />;
}
