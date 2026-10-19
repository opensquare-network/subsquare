import { isNil } from "lodash-es";
import { useRouter } from "next/router";
import { cn } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import TokenIcon from "next-common/components/assethubMigrationAssets/swap/components/tokenIcon";
import { formatPrice } from "next-common/components/assethubMigrationAssets/liquidPools/utils";
import { formatPercent, permillToPercent } from "./psmUtils";
import { TableCard } from "./styled";
import useDotUsdPool from "./useDotUsdPool";

// The table cell already carries textPrimary, and ValueDisplay puts the class on its symbol
// too, so a text color here would override the tertiary symbol. Only the font is set.
const VALUE_CLASS = "text14Medium";
const DOTUSD_ASSET_ID = 7873;

function PoolCell({ pool }) {
  return (
    <span className={cn("inline-flex items-center gap-x-2", VALUE_CLASS)}>
      <span className="inline-flex items-center -space-x-2">
        <TokenIcon token={{ type: "native" }} />
        <TokenIcon
          token={{ assetId: DOTUSD_ASSET_ID, symbol: pool.dotUsdSymbol }}
        />
      </span>
      <span>
        {pool.dotSymbol} / {pool.dotUsdSymbol}
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
        value={pool.dotReserve.toString()}
        symbol={pool.dotSymbol}
      />
      <ValueDisplay
        className={VALUE_CLASS}
        value={pool.dotUsdReserve.toString()}
        symbol={pool.dotUsdSymbol}
      />
    </div>
  );
}

function PriceCell({ pool }) {
  return (
    <span className={VALUE_CLASS}>
      1 <span className="text-textTertiary">{pool.dotSymbol}</span> ≈{" "}
      {formatPrice(pool.price)}{" "}
      <span className="text-textTertiary">{pool.dotUsdSymbol}</span>
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
  const { pool, isLoading } = useDotUsdPool();

  const rows = [];
  if (pool) {
    const row = [
      <PoolCell key="pool" pool={pool} />,
      <ReservesCell key="reserves" pool={pool} />,
      <PriceCell key="price" pool={pool} />,
      <span key="fee" className={cn("num", VALUE_CLASS)}>
        {formatPercent(permillToPercent(pool.lpFee))}
      </span>,
      isNil(pool.tvl) ? (
        <span key="tvl" className={cn(VALUE_CLASS, "text-textTertiary")}>
          —
        </span>
      ) : (
        <ValueDisplay
          key="tvl"
          className={VALUE_CLASS}
          value={pool.tvl.toString()}
          symbol={pool.dotUsdSymbol}
        />
      ),
    ];
    row.onClick = () =>
      router.push({
        pathname: "/assets",
        query: {
          tab: "swap",
          tokenIn: "native",
          tokenOut: pool.dotUsdKey,
        },
      });
    rows.push(row);
  }

  return (
    <TableCard
      columns={columns}
      rows={rows}
      loading={isLoading}
      noDataText="The DOT/dotUSD pool was not found"
    />
  );
}
