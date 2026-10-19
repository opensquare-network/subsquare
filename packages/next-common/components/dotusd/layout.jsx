import ListLayout from "next-common/components/layout/ListLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DotUsdProvider from "./context";
import DotUsdSummary from "./summary";
import { DOT_USD_TABS, DotUsdTabsProvider, useDotUsdTabs } from "./tabs";

export function Section({ title, hint, children }) {
  return (
    <div>
      <div className="mb-4">
        <TitleContainer>{title}</TitleContainer>
        {/* TitleContainer carries px-6, the hint needs the same inset to line up. */}
        {hint && (
          <p className="mt-2 px-6 text12Medium text-textTertiary">{hint}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// The header of every dotUSD page: the title, the summary of the PSM instance and the tabs
// between the overview and the swap records. The tabs are switched in place, so the active one
// comes from the tabs context rather than from the router.
function DotUsdHeader({ children }) {
  const { activeTab, setActiveTab } = useDotUsdTabs();

  return (
    <ListLayout
      title="dotUSD"
      description="Peg stability module on Polkadot Asset Hub"
      summary={<DotUsdSummary />}
      tabs={DOT_USD_TABS}
      activeTabValue={activeTab}
      onTabClick={(tab) => setActiveTab(tab.value)}
    >
      {children}
    </ListLayout>
  );
}

/**
 * The shell of the dotUSD page. Both the PSM data and the selected tab are shared by the header
 * and the content below it.
 */
export default function DotUsdLayout({ children }) {
  return (
    <DotUsdProvider>
      <DotUsdTabsProvider>
        <DotUsdHeader>{children}</DotUsdHeader>
      </DotUsdTabsProvider>
    </DotUsdProvider>
  );
}
