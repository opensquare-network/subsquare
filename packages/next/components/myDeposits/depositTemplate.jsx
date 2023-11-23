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
import { useChain } from "next-common/context/chain";
import { first } from "lodash";
import Descriptions from "next-common/components/Descriptions";

export default function DepositTemplate({
  name = "",
  icon,
  pathname,
  activeCount,
  items = [],
}) {
  const chain = useChain();

  const activeItems = (items || [])
    .filter((item) => !isNil(item.activeCount))
    .filter((item) => !item.excludeToChains?.includes(chain));

  const firstActiveItem = first(activeItems);
  const titleLink = firstActiveItem?.pathname ?? pathname;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } else if (api?.path) {
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

    if (!tabTableLoaded[label]) {
      return;
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {sm ? (
        <MobileList rows={rows} columns={columns} />
      ) : (
        <StyledList
          className="!shadow-none !border-none !p-0"
          columns={columns?.map((col) => ({
            ...col,
            name: (
              <div className="text14Medium tracking-normal">{col.name}</div>
            ),
          }))}
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
function MobileList({ rows = [], columns = [] }) {
  return (
    <div className="mb-4">
      {rows.map((row, idx) => {
        const title = row[0];
        const status = last(row);
        // without title and status
        const rest = row.slice(1, -1);
        const descriptionsLabels = columns.slice(1, -1).map((col) => col.name);

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
            {title}

            <div className="flex items-center justify-end">{status}</div>

            <Descriptions items={descriptionItems} />
          </div>
        );
      })}
    </div>
  );
}
