import { useState } from "react";

function PriceCell({ item }) {
  const [inverted, setInverted] = useState(false);

  const value = inverted ? item.invertedPrice : item.price;
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
  style: { textAlign: "right", minWidth: "210px" },
  render: (item) => <PriceCell item={item} />,
};
