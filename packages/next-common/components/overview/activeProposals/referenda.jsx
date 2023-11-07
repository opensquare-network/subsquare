import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import { useChain } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { cn } from "next-common/utils";
import { getFeaturedMenu } from "next-common/utils/consts/menu";
import Link from "next/link";
import { useState } from "react";

export default function ActiveReferenda() {
  const chain = useChain();
  const { tracks, fellowshipTracks, summary } = usePageProps();

  const menu = getFeaturedMenu({ tracks, fellowshipTracks, summary })
    .filter((m) => !m.excludeToChains?.includes?.(chain))
    .filter((m) => m.items);
  console.log(menu);

  return (
    <div className="space-y-4">
      {menu.map((m, idx) => (
        <Tmpl key={idx} {...m} />
      ))}
    </div>
  );
}

function Tmpl({ name = "", icon, pathname, activeCount, items = [] }) {
  const hasAllPage = items.some((m) => m.value === "all");

  let title = (
    <div
      className={cn(
        "flex items-center",
        "text14Bold text-textPrimary capitalize",
      )}
    >
      <span className="mr-2 [&_svg_path]:fill-textSecondary">{icon}</span>
      {name?.toLowerCase?.()}
      <span className="text14Medium text-textTertiary ml-1">{activeCount}</span>
    </div>
  );
  if (hasAllPage) {
    title = (
      <Link
        href={pathname}
        className="cursor-pointer hover:underline"
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
        content: <div>{m.name}</div>,
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
