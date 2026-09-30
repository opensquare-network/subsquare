import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Line } from "react-chartjs-2";
import "next-common/components/charts/globalConfig";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import LegendItem from "next-common/components/charts/legend/item";
import ChartCard from "next-common/components/styled/containers/chartCard";
import { StatisticsTitle } from "next-common/components/statistics/styled";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { SummaryDescription } from "next-common/components/summary/styled";
import LoadableContent, {
  LoadStyles,
} from "next-common/components/common/loadableContent";
import NoData from "next-common/components/noData";
import ExternalLink from "next-common/components/externalLink";
import ValueDisplay from "next-common/components/valueDisplay";
import { useDapContext } from "./context";
import { calcSupplyProjection } from "./supplyProjection";
import useSupplyChart, { supplyTooltipPlugin } from "./useSupplyChart";
import useSupplyHistory from "./useSupplyHistory";

dayjs.extend(utc);

function NextPeriodSummary({ nextPeriod }) {
  if (!nextPeriod) {
    return null;
  }

  return (
    <SummaryLayout className="grid-cols-3 max-sm:grid-cols-1 max-md:grid-cols-1 mb-8">
      <SummaryItem title="Next issuance rate">
        <ValueDisplay value={nextPeriod.annualIssuance} symbol="DOT / year" />
      </SummaryItem>
      <SummaryItem title="Expected period">
        {dayjs.utc(nextPeriod.start).format("YYYY-MM-DD")}
        {" - "}
        {dayjs.utc(nextPeriod.end).format("YYYY-MM-DD")}
      </SummaryItem>
      <SummaryItem title="Reduction">
        {Math.abs(nextPeriod.changePercent)}%
      </SummaryItem>
    </SummaryLayout>
  );
}

function SupplyLegend({ datasets }) {
  return (
    <div className="flex flex-wrap gap-y-2 items-center justify-center mt-4">
      {datasets.map(({ label, backgroundColor, borderDash }) => (
        <LegendItem
          key={label}
          color={backgroundColor}
          dashed={!!borderDash?.length}
        >
          {label}
        </LegendItem>
      ))}
    </div>
  );
}

function SupplyChartContent({ data, options, datasets, nextPeriod }) {
  if (datasets.length === 0) {
    return <NoData showIcon={false} text="No supply data available." />;
  }

  return (
    <>
      <NextPeriodSummary nextPeriod={nextPeriod} />
      <div className="h-[300px]">
        <Line
          data={data}
          options={options}
          plugins={[hoverLinePlugin, supplyTooltipPlugin]}
          role="img"
          aria-label="Actual annual DOT issuance, planned annual issuance, actual monthly supply and projected monthly supply through 2050"
        />
      </div>
      <SupplyLegend datasets={datasets} />
    </>
  );
}

function SupplyChart() {
  const { supplyData, isSupplyLoading, supplyError } = useDapContext();
  const { supply } = useSupplyHistory();
  const projection = supplyData && calcSupplyProjection(supplyData);
  const { data, options } = useSupplyChart(
    projection?.points ?? [],
    supplyData?.timestamp,
    supply.value,
  );
  const nextPeriod = projection?.nextPeriod;
  const datasets = data.datasets.filter(({ data }) =>
    data.some(({ y }) => Number.isFinite(y)),
  );
  const isLoading = isSupplyLoading || supply.loading;
  const hasError = !!(supplyError || supply.error);

  return (
    <div
      className={
        isLoading ? "flex h-[300px] items-center justify-center" : undefined
      }
    >
      <LoadableContent
        isLoading={isLoading}
        style={LoadStyles.CIRCLE}
        size={24}
      >
        <SupplyChartContent
          data={data}
          options={options}
          datasets={datasets}
          nextPeriod={nextPeriod}
        />
        {hasError && (
          <SummaryDescription className="mt-4 text12Medium">
            Some chart data could not be loaded.
          </SummaryDescription>
        )}
      </LoadableContent>
    </div>
  );
}

export default function DapSupply() {
  return (
    <ChartCard
      className="mt-4"
      title={<StatisticsTitle className="mb-0">Supply</StatisticsTitle>}
      titleExtra={
        <ExternalLink href="https://wiki.polkadot.com/learn/learn-dot/#total-supply">
          Wiki
        </ExternalLink>
      }
      chart={<SupplyChart />}
    />
  );
}
