import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "next-common/components/pagination";
import StyledList from "next-common/components/styledList";
import nextApi from "next-common/services/nextApi";

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
    .sort((a, b) => b.activeCount - a.activeCount)
    .map((m) => {
      return {
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
  const pageSize = 8;
  const [result, setResult] = useState({});

  useEffect(() => {
    if (api) {
      nextApi
        .fetch(api?.path, { ...api.params, page, pageSize })
        .then((resp) => {
          if (resp.result) {
            setResult(resp.result);
          }
        });
    }
  }, [api, page, pageSize]);

  const rows = result?.items?.map((item) => {
    const data = formatter(item);
    return columns.map((col) => col.cellRender?.(data, item, result.items));
  });

  return (
    <div>
      <StyledList
        className="!shadow-none !border-none !p-0"
        columns={columns?.map((col) => ({
          ...col,
          name: <div className="text14Medium tracking-normal">{col.name}</div>,
        }))}
        rows={rows}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={result.total || 0}
        onPageChange={(e, newPage) => {
          e.preventDefault();
          setPage(newPage);
        }}
      />
    </div>
  );
}
