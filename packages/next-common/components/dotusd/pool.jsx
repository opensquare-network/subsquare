import { useRouter } from "next/router";
import { cn } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import TokenIcon from "next-common/components/assethubMigrationAssets/swap/components/tokenIcon";
import {
  formatAmount,
  formatPrice,
} from "next-common/components/assethubMigrationAssets/liquidPools/utils";
import { formatPercent, permillToPercent } from "./psmUtils";
import { TableCard } from "./styled";
import useDotUsdPools from "./useDotUsdPools";

// The table cell already carries textPrimary, and ValueDisplay puts the class on its symbol
// too, so a text color here would override the tertiary symbol. Only the font is set.
const VALUE_CLASS = "text14Medium";

function PoolCell({ pool }) {
  return (
    <span className={cn("inline-flex items-center gap-x-2", VALUE_CLASS)}>
      <span className="inline-flex items-center -space-x-2">
        <TokenIcon token={pool.otherToken} />
        <TokenIcon token={pool.dotUsdToken} />
      </span>
      <span>
        {pool.otherToken.symbol} / {pool.dotUsdToken.symbol}
      </span>
    </span>
  );
}

// The two reserves stack and right align, the layout the liquidity pools page reads them in.
function ReservesCell({ pool }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <ValueDisplay
        className={VALUE_CLASS}
        value={formatAmount(pool.otherReserve)}
        symbol={pool.otherToken.symbol}
      />
      <ValueDisplay
        className={VALUE_CLASS}
        value={formatAmount(pool.dotUsdReserve)}
        symbol={pool.dotUsdToken.symbol}
      />
    </div>
  );
}

function PriceCell({ pool }) {
  const price = formatPrice(pool.price);
  if (!price) {
    return <span className={cn(VALUE_CLASS, "text-textTertiary")}>—</span>;
  }

  return (
    <span className={VALUE_CLASS}>
      1 <span className="text-textTertiary">{pool.otherToken.symbol}</span> ≈{" "}
      {price}{" "}
      <span className="text-textTertiary">{pool.dotUsdToken.symbol}</span>
    </span>
  );
}

const columns = [
  { name: "Pool", className: "text-left" },
  {
    name: "Reserves",
    className: "text-right",
    style: { width: "160px", minWidth: "160px" },
  },
  { name: "Price", className: "text-right" },
  { name: "LP fee", className: "text-right" },
  { name: "TVL", className: "text-right" },
];

export default function DotUsdPool() {
  const router = useRouter();
  const { pools, isLoading } = useDotUsdPools();

  const rows = pools.map((pool) => {
    const row = [
      <PoolCell key="pool" pool={pool} />,
      <ReservesCell key="reserves" pool={pool} />,
      <PriceCell key="price" pool={pool} />,
      <span key="fee" className={cn("num", VALUE_CLASS)}>
        {formatPercent(permillToPercent(pool.lpFee))}
      </span>,
      <ValueDisplay
        key="tvl"
        className={VALUE_CLASS}
        value={pool.tvl.toString()}
        symbol={pool.dotUsdToken.symbol}
      />,
    ];
    row.onClick = () =>
      router.push({
        pathname: "/assets",
        query: {
          tab: "swap",
          tokenIn: pool.otherToken.key,
          tokenOut: pool.dotUsdToken.key,
        },
      });
    return row;
  });

  return (
    <TableCard
      columns={columns}
      rows={rows}
      loading={isLoading}
      noDataText="No dotUSD pools found"
    />
  );
}
