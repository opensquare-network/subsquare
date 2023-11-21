import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import nextApi from "next-common/services/nextApi";
import { activeProposalFetchParams } from "next-common/services/serverSide/activeProposals";
import isNil from "lodash.isnil";
import { useUpdateEffect } from "usehooks-ts";
import { useChain } from "next-common/context/chain";
import OverviewAccordionTable from "../accordionTable";

export default function ActiveProposalTemplate({
  name = "",
  icon,
  pathname,
  activeCount,
  items = [],
}) {
  const chain = useChain();
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

  const [tabTableLoaded, setTabTableLoaded] = useState({});
  const tabs = (items || [])
    ?.filter((item) => item.activeCount)
    ?.filter((item) => !item.excludeToChains?.includes(chain))
    .map((m) => {
      return {
        label: m.name,
        activeCount: m.activeCount,
        content: (
          <TableTemplate
            tabTableLoaded={tabTableLoaded}
            label={m.name}
            {...m}
          />
        ),
      };
    });

  const [activeTabLabel, setActiveTabLabel] = useState(tabs[0].label);
  useEffect(() => {
    setTabTableLoaded({
      ...tabTableLoaded,
      [activeTabLabel]: true,
    });
  }, [activeTabLabel]);

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
  }, [tabTableLoaded]);

  useUpdateEffect(fetchData, [page]);

  const rows = result?.items?.map((item) => {
    const formattedItem = formatter(item);
    return columns.map((col) =>
      col.cellRender?.(formattedItem, item, result.items),
    );
  });

  return (
    <OverviewAccordionTable
      columns={columns}
      rows={rows}
      page={page}
      setPage={setPage}
      loading={loading}
      total={result?.total}
      pageSize={activeProposalFetchParams.pageSize}
    />
  );
}
