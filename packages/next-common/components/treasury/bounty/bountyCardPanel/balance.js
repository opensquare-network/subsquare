import React from "react";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import SymbolValue from "next-common/components/pages/components/gov2/sidebar/tally/values/symbolValue";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";

function Balance({ address, value }) {
  const { balance } = useSubAddressBalance(address);

  return (
    <span className="flex-1">
      <span className="flex flex-col">
        <span className="text-textTertiary text12Medium">Balance</span>
        <SymbolValue value={balance} />
        <span className="mt-1 text12Medium text-textTertiary">
          <FiatPriceLabel free={value} />
        </span>
      </span>
    </span>
  );
}

export default React.memo(Balance);
