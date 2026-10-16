import ListLayout from "next-common/components/layout/ListLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DotUsdProvider from "./context";
import DotUsdSummary from "./summary";

export const DOT_USD_TABS = [
  { value: "overview", label: "Overview", url: "/dotusd" },
  { value: "mint", label: "Mint records", url: "/dotusd/mint" },
  { value: "redeem", label: "Redeem records", url: "/dotusd/redeem" },
];

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

/**
 * The shell of every dotUSD page: the title, the summary of the PSM instance and the tabs
 * between the overview and the swap records. Every page reads the PSM storage, so the header
 * carries the same summary whichever tab is open; the records tables themselves read the scan
 * api and do not wait on that storage.
 */
export default function DotUsdLayout({
  summary = <DotUsdSummary />,
  children,
}) {
  return (
    <DotUsdProvider>
      <ListLayout
        title="dotUSD"
        description="Peg stability module on Polkadot Asset Hub"
        summary={summary}
        tabs={DOT_USD_TABS}
      >
        {children}
      </ListLayout>
    </DotUsdProvider>
  );
}
