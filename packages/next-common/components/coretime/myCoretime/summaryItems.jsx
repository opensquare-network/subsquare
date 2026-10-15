import { SystemLoadingDots } from "@osn/icons/subsquare";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import Tooltip from "next-common/components/tooltip";

const ITEMS = [
  {
    key: "regions",
    title: "My Regions",
    tooltip:
      "Regions you own that are active or upcoming (expired ones are not counted)",
  },
  {
    key: "cores",
    title: "My Cores",
    tooltip:
      "Cores bought or renewed for the current or the next period, plus the cores of your regions and of your coretime pool contributions",
  },
  {
    key: "pendingRenewals",
    title: "Pending Renewals",
    tooltip:
      "Your cores with a renewal right available and auto-renewal not enabled",
  },
  {
    key: "autoRenew",
    title: "Auto-renew",
    tooltip: "Your cores with auto-renewal enabled",
  },
];

const secondaryTextClass = "text-white/75";

function formatTimeslice(timeslice) {
  return `#${Number(timeslice).toLocaleString("en-US")}`;
}

function RegionListItem({ region }) {
  const hasShare =
    Number.isFinite(region.parts) && Number.isFinite(region.totalParts);

  return (
    <div className="flex items-center gap-x-2 whitespace-nowrap">
      <span>{`Core #${region.core}`}</span>
      {hasShare && (
        <span className={secondaryTextClass}>
          {`${region.parts}/${region.totalParts}`}
        </span>
      )}
      <span className={secondaryTextClass}>
        {`${formatTimeslice(region.begin)} – ${formatTimeslice(region.end)}`}
      </span>
    </div>
  );
}

function CoreListItem({ core }) {
  return <div className="whitespace-nowrap">{`Core #${core}`}</div>;
}

const toCoreItems = (cores) =>
  (cores ?? []).map((core) => ({ key: core, core }));

function buildListTooltip(items, renderItem) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.key}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

function ValueWithTooltip({ value, content }) {
  if (!content) {
    return value;
  }

  return (
    <Tooltip content={content} contentClassName="max-w-[360px]">
      <span>{value}</span>
    </Tooltip>
  );
}

export default function MyCoretimeSummaryItems({ summary, loading }) {
  const regionItems = (summary.regionList ?? []).map((region) => ({
    key: `${region.begin}-${region.core}-${region.mask}`,
    region,
  }));
  const renderCoreItem = ({ core }) => <CoreListItem core={core} />;

  const tooltips = {
    regions: buildListTooltip(regionItems, ({ region }) => (
      <RegionListItem region={region} />
    )),
    cores: buildListTooltip(toCoreItems(summary.coreList), renderCoreItem),
    pendingRenewals: buildListTooltip(
      toCoreItems(summary.pendingRenewalList),
      renderCoreItem,
    ),
    autoRenew: buildListTooltip(
      toCoreItems(summary.autoRenewList),
      renderCoreItem,
    ),
  };

  return (
    <SummaryLayout>
      {ITEMS.map(({ key, title, tooltip }) => (
        <SummaryItem
          key={key}
          title={
            <Tooltip content={tooltip}>
              <span>{title}</span>
            </Tooltip>
          }
        >
          {loading ? (
            <SystemLoadingDots width={20} height={20} />
          ) : (
            <ValueWithTooltip value={summary[key]} content={tooltips[key]} />
          )}
        </SummaryItem>
      ))}
    </SummaryLayout>
  );
}
