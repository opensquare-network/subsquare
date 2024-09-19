import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { recentProposalFetchParams } from "next-common/services/serverSide/recentProposals";
import { isNil } from "lodash-es";
import { useUpdateEffect } from "react-use";
import { first } from "lodash-es";
import Pagination from "next-common/components/pagination";
import Loading from "next-common/components/loading";
import DataList from "../dataList";

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
  const activeItems = (items || []).filter((item) => item.activeCount);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    setTabTableLoaded({
      ...tabTableLoaded,
      [activeTabLabel]: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      <DataList
        columns={columns}
        loading={loading}
        rows={rows}
        noDataText="No active proposals"
      />

      <Pagination
        page={page}
        pageSize={recentProposalFetchParams.pageSize}
        total={result?.total || 0}
        onPageChange={(e, newPage) => {
          e.preventDefault();
          setPage(newPage);
        }}
      />
    </div>
  );
}
