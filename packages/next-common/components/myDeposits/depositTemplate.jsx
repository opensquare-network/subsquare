import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { activeProposalFetchParams } from "next-common/services/serverSide/activeProposals";
import isNil from "lodash.isnil";
import { useUpdateEffect } from "usehooks-ts";
import { useChain } from "next-common/context/chain";
import { first, last } from "lodash";
import Descriptions from "next-common/components/Descriptions";
import Pagination from "next-common/components/pagination";
import StyledList from "next-common/components/styledList";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import Loading from "next-common/components/loading";

const loadingContent = (
  <div className="mt-4 mb-2 flex justify-center">
    <Loading size={24} />
  </div>
);

export function DepositTitle({ title, icon, extra = null }) {
  return (
    <div
      className={cn(
        "flex items-center",
        "text14Bold text-textPrimary capitalize",
      )}
    >
      <span className="mr-2 [&_svg_path]:fill-textSecondary">{icon}</span>
      <span className="group-hover/title:underline">
        {title?.toLowerCase?.()}
      </span>
      {extra}
    </div>
  );
}

export default function DepositTemplate({
  name = "",
  icon,
  pathname,
  activeCount,
  items = [],
  children,
  loading,
}) {
  const chain = useChain();

  const activeItems = (items || [])
    .filter((item) => item.activeCount)
    .filter((item) => !item.excludeToChains?.includes(chain));

  const firstActiveItem = first(activeItems);
  const titleLink = firstActiveItem?.pathname ?? pathname;

  let title = (
    <DepositTitle
      title={name}
      icon={icon}
      extra={
        <span className="text14Medium text-textTertiary ml-1">
          {activeCount}
        </span>
      }
    />
  );

  if (titleLink) {
    title = (
      <Link
        href={titleLink}
        className="group/title cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        {title}
      </Link>
    );
  }

  const [tabTableLoaded, setTabTableLoaded] = useState({});
  const tabs = activeItems.map((m) => {
    return {
      label: m.name,
      activeCount: m.activeCount,
      content: (
        <TableTemplate tabTableLoaded={tabTableLoaded} label={m.name} {...m} />
      ),
    };
  });

  const [activeTabLabel, setActiveTabLabel] = useState(tabs[0]?.label);
  useEffect(() => {
    setActiveTabLabel(tabs[0]?.label);
  }, [items]);

  useEffect(() => {
    setTabTableLoaded({
      ...tabTableLoaded,
      [activeTabLabel]: true,
    });
  }, [activeTabLabel]);

  if (!activeCount || loading) {
    return (
      <SecondaryCard>
        <div className="flex">{title}</div>

        {loading && loadingContent}
      </SecondaryCard>
    );
  }

  return (
    <AccordionCard title={title} defaultOpen>
      {children || (
        <Tabs
          tabs={tabs}
          activeTabLabel={activeTabLabel}
          onTabClick={(tab) => setActiveTabLabel(tab.label)}
        />
      )}
    </AccordionCard>
  );
}

function TableTemplate({
  tabTableLoaded = {},
  label,
  columns,
  api,
  formatter = (i) => i,
  tableHead,
}) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(api?.initData);
  const [loading, setLoading] = useState(!api?.initData ?? true);
  const { sm } = useScreenSize();

  function fetchData() {
    if (api?.fetchData) {
      api
        .fetchData()
        .then((resp) => {
          if (resp?.result) {
            setResult(resp.result);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  useEffect(() => {
    if (!isNil(result)) {
      return;
    }

    if (!tabTableLoaded[label]) {
      return;
    }

    fetchData();
  }, [tabTableLoaded]);

  useUpdateEffect(fetchData, [page, api?.fetchData]);

  const rows = result?.items?.map((item) => {
    const formattedItem = formatter(item);
    return columns.map((col) =>
      col.cellRender?.(formattedItem, item, result.items),
    );
  });

  return (
    <div>
      {tableHead}

      {sm ? (
        <MobileList rows={rows} columns={columns} loading={loading} />
      ) : (
        <StyledList
          className="!shadow-none !border-none !p-0"
          columns={columns}
          loading={loading}
          rows={rows}
          noDataText="No active proposals"
        />
      )}

      <Pagination
        page={page}
        pageSize={activeProposalFetchParams.pageSize}
        total={result?.total || 0}
        onPageChange={(e, newPage) => {
          e.preventDefault();
          setPage(newPage);
        }}
      />
    </div>
  );
}

function MobileList({ rows = [], columns = [], loading }) {
  const hasActionColumn = last(columns).name === "";
  const lastIndex = columns.length - (hasActionColumn ? 2 : 1);

  if (loading) {
    return loadingContent;
  }

  return (
    <div className="mb-4">
      {rows.map((row, idx) => {
        const title = row[0];
        const status = row[lastIndex];
        const action = hasActionColumn ? last(row) : null;
        // without title and status
        const rest = row.slice(1, lastIndex);
        const descriptionsLabels = columns
          .slice(1, lastIndex)
          .map((col) => col.name);

        const descriptionItems = rest.map((value, idx) => {
          return {
            label: (
              <span className="text-textTertiary">
                {descriptionsLabels[idx]}
              </span>
            ),
            value,
            className: "h-auto",
          };
        });

        return (
          <div
            key={idx}
            className="py-4 first:pt-0 border-b border-neutral300 space-y-3"
          >
            <div className="flex items-center">
              {title}
              {action}
            </div>

            <div className="flex items-center justify-end">{status}</div>

            <Descriptions items={descriptionItems} />
          </div>
        );
      })}
    </div>
  );
}
