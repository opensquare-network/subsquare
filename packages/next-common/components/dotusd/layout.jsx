import ListLayout from "next-common/components/layout/ListLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DotUsdProvider from "./context";

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
 * The shell of every dotUSD page: the title, and the tabs between the overview and the swap
 * records. `withPsmState` is for the pages whose panels read the PSM storage; the records
 * pages do not, and their tables must not depend on the chain being reachable.
 */
export default function DotUsdLayout({
  summary,
  children,
  withPsmState = true,
}) {
  const layout = (
    <ListLayout
      title="dotUSD"
      description="Peg stability module on Polkadot Asset Hub"
      summary={summary}
      tabs={DOT_USD_TABS}
    >
      {children}
    </ListLayout>
  );

  return withPsmState ? <DotUsdProvider>{layout}</DotUsdProvider> : layout;
}
