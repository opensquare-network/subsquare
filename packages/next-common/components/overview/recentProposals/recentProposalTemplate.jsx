import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "next-common/components/pagination";
import nextApi from "next-common/services/nextApi";
import { recentProposalFetchParams } from "next-common/services/serverSide/recentProposals";
import isNil from "lodash.isnil";
import { useUpdateEffect } from "usehooks-ts";
import { useChain } from "next-common/context/chain";
import { first } from "lodash";
import DataList from "next-common/components/dataList";

export default function RecentProposalTemplate({
  name = "",
  icon,
  pathname,
  activeCount,
  items = [],
}) {
  const chain = useChain();

  const activeItems = (items || [])
    .filter((item) => item.activeCount)
    .filter((item) => !item.excludeToChains?.includes(chain));

  const titleLink =
    first(activeItems)?.pathname ?? first(items)?.pathname ?? pathname;

  let title = (
    <div
      className={cn(
        "flex items-center",
        "text14Bold text-textPrimary capitalize",
      )}
    >
      <span className="mr-2 [&_svg_path]:fill-textSecondary">{icon}</span>
      <span className="group-hover/title:underline">
        {name?.toLowerCase?.()}
      </span>
      <span className="text14Medium text-textTertiary ml-1">{activeCount}</span>
    </div>
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
    setTabTableLoaded({
      ...tabTableLoaded,
      [activeTabLabel]: true,
    });
  }, [activeTabLabel]);

  if (!activeCount) {
    return <SecondaryCard className="flex">{title}</SecondaryCard>;
  }

  return (
    <AccordionCard title={title} defaultOpen>
      <Tabs
        tabs={tabs}
        activeTabLabel={activeTabLabel}
        onTabClick={(tab) => setActiveTabLabel(tab.label)}
      />
    </AccordionCard>
  );
}

function TableTemplate({
  tabTableLoaded = {},
  label,
  columns,
  api,
  formatter = (i) => i,
}) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(api?.initData);
  const [loading, setLoading] = useState(!api?.initData ?? true);

  function fetchData() {
    if (api?.path) {
      nextApi
        .fetch(api?.path, { ...api.params, page, ...recentProposalFetchParams })
        .then((resp) => {
          if (resp.result) {
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

  useUpdateEffect(fetchData, [page]);

  const rows = result?.items?.map((item) => {
    const formattedItem = formatter(item);
    return columns.map((col) =>
      col.cellRender?.(formattedItem, item, result.items),
    );
  });

  return (
    <div>
      <DataList
        columns={columns}
        loading={loading}
        rows={rows}
        noDataText="No active proposals"
      />

      {!isNil(result?.page) && (
        // pagination itself has `pt-2`(8px)
        <div className="mt-2">
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
      )}

      {api?.viewAllLink && (
        <div className="flex grow justify-end mt-[24px]">
          <a
            className="text14Medium text-theme500 "
            href={api?.viewAllLink}
            target="_blank"
            rel="noreferrer"
          >
            View all
          </a>
        </div>
      )}
    </div>
  );
}
