import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "next-common/components/pagination";
import StyledList from "next-common/components/styledList";
import nextApi from "next-common/services/nextApi";
import { activeProposalFetchParams } from "next-common/services/serverSide/activeProposals";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import last from "lodash.last";
import isNil from "lodash.isnil";
import { useUpdateEffect } from "usehooks-ts";

export default function ActiveProposalTemplate({
  name = "",
  icon,
  pathname,
  activeCount,
  items = [],
}) {
  const hasAllPage = items.some((m) => m.value === "all");

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
  if (hasAllPage) {
    title = (
      <Link
        href={pathname}
        className="group/title cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        {title}
      </Link>
    );
  }

  if (!activeCount) {
    return <SecondaryCard className="flex">{title}</SecondaryCard>;
  }

  const tabs = (items || [])
    .filter((m) => m.activeCount)
    .map((m, idx) => {
      return {
        lazy: m.lazy ?? idx !== 0,
        label: m.name,
        activeCount: m.activeCount,
        content: <TableTemplate {...m} />,
      };
    });

  const [activeTabLabel, setActiveTabLabel] = useState(tabs[0].label);

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

function TableTemplate({ columns, api, formatter = (i) => i }) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(api?.initData);
  const [loading, setLoading] = useState(false);
  const { sm } = useScreenSize();

  function fetchData() {
    if (api?.path) {
      setLoading(true);

      nextApi
        .fetch(api?.path, { ...api.params, page, ...activeProposalFetchParams })
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

    fetchData();
  }, []);

  useUpdateEffect(fetchData, [page]);

  const rows = result?.items?.map((item) => {
    const formattedItem = formatter(item);
    return columns.map((col) =>
      col.cellRender?.(formattedItem, item, result.items),
    );
  });

  return (
    <div>
      {sm ? (
        <MobileList rows={rows} />
      ) : (
        <StyledList
          className="!shadow-none !border-none !p-0"
          columns={columns?.map((col) => ({
            ...col,
            name: (
              <div className="text14Medium tracking-normal">{col.name}</div>
            ),
          }))}
          rows={rows}
          loading={loading}
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

function MobileList({ rows = [] }) {
  return (
    <div className="mb-4">
      {rows.map((row, idx) => {
        const title = row[0];
        const status = last(row);
        // without title and status
        const rest = row.slice(1, -1);

        return (
          <div
            key={idx}
            className="py-4 first:pt-0 border-b border-neutral300 space-y-3"
          >
            {title}
            <div className="flex items-center justify-between">
              {!!rest?.length && (
                <div className="flex">
                  {rest.map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      {item}
                      {idx !== rest.length - 1 && (
                        <span className="mx-2 text12Medium text-textTertiary">
                          ·
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {status}
            </div>
          </div>
        );
      })}
    </div>
  );
}
