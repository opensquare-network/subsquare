import { useState } from "react";
import { formatPrice, toTokenUnits } from "../../utils";

// Compute the token pair price from a pool's raw reserves:
// 1 token1 = X token2, plus the inverted direction (1 token2 = Y token1).
function computePoolPrice(pool, inverted) {
  const [reserve1, reserve2] = pool.reserves;

  const reserve1Units = toTokenUnits(reserve1, pool.token1.decimals);
  const reserve2Units = toTokenUnits(reserve2, pool.token2.decimals);

  const price = reserve1Units.gt(0) ? reserve2Units.div(reserve1Units) : null;
  const invertedPrice = reserve2Units.gt(0)
    ? reserve1Units.div(reserve2Units)
    : null;

  return inverted ? invertedPrice : price;
}

function PriceCell({ item }) {
  const [inverted, setInverted] = useState(false);

  const value = formatPrice(computePoolPrice(item, inverted));
  if (!value) {
    return <span className="text14Medium text-textTertiary">-</span>;
  }

  const baseSymbol = inverted ? item.token2.symbol : item.token1.symbol;
  const quoteSymbol = inverted ? item.token1.symbol : item.token2.symbol;

  return (
    <div className="flex items-center justify-end gap-1">
      <span className="text14Medium text-textPrimary">
        1 <span className="text-textTertiary">{baseSymbol}</span> ≈ {value}{" "}
        <span className="text-textTertiary">{quoteSymbol}</span>
      </span>
      <button
        type="button"
        aria-label="Toggle price direction"
        className="text-textTertiary transition-colors hover:text-theme500"
        onClick={() => setInverted((v) => !v)}
      >
        <span className="text-[16px] leading-none select-none">⇄</span>
      </button>
    </div>
  );
}

export const colPrice = {
  name: "Price",
  style: { textAlign: "right", width: "260px", minWidth: "260px" },
  render: (item) => <PriceCell item={item} />,
};
