import { createContext, useCallback, useContext, useState } from "react";
import { formatPrice, toTokenUnits } from "../../utils";
import Tooltip from "next-common/components/tooltip";

// Shared price direction state, controlled from the column header.
// `inverted` toggles every row between:
//   "1 token1 = X token2"  (Price (A/B))
//   "1 token2 = X token1"  (Price (B/A))
const PriceDirectionContext = createContext({
  inverted: false,
  toggle: () => {},
});

export function PriceDirectionProvider({ children }) {
  const [inverted, setInverted] = useState(false);
  const toggle = useCallback(() => setInverted((v) => !v), []);

  return (
    <PriceDirectionContext.Provider value={{ inverted, toggle }}>
      {children}
    </PriceDirectionContext.Provider>
  );
}

export function usePriceDirection() {
  return useContext(PriceDirectionContext);
}

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

function PriceColumnHeader() {
  const { toggle } = usePriceDirection();

  return (
    <Tooltip content="Click to toggle between 1 token1 = X token2 and 1 token2 = Y token1">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-1 transition-colors text-theme500"
      >
        <span>Price</span>
      </button>
    </Tooltip>
  );
}

function PriceCell({ item }) {
  const { inverted } = usePriceDirection();

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
    </div>
  );
}

export const colPrice = {
  name: <PriceColumnHeader />,
  style: { textAlign: "right", width: "260px", minWidth: "260px" },
  render: (item) => <PriceCell item={item} />,
};
