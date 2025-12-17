import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProjectStatisticsChart from "./chart";
// import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
// import Tooltip from "next-common/components/tooltip";
import WindowSizeProvider from "next-common/context/windowSize";

export default function Statistics({ data }) {
  const { label, category, projects = [], totalFiat } = data ?? {};

  if (projects?.length === 0 || !totalFiat || !label || !category) {
    return null;
  }

  return (
    <WindowSizeProvider>
      <SecondaryCard className="flex flex-col gap-y-4">
        <div className="text-textPrimary text14Bold">
          {label}
          {/* <Tooltip content="The prices are calculated at awarded time."></Tooltip> */}
        </div>
        <div className="flex gap-x-6 gap-y-4 justify-start w-full max-sm:flex-col">
          <ProjectStatisticsChart
            projects={projects}
            totalFiat={totalFiat}
            category={category}
          />
        </div>
      </SecondaryCard>
    </WindowSizeProvider>
  );
}
