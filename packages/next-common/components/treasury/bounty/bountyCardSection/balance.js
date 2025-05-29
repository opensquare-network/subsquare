import React from "react";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

function Balance({ address }) {
  const { balance, isLoading } = useSubAddressBalance(address);
  const { symbol, decimals } = useChainSettings();

  if (isNil(balance)) return null;

  return (
    <LoadableContent isLoading={isLoading}>
      <span className="mt-1">
        <ValueDisplay
          className="text16Bold leading-5"
          value={toPrecision(balance, decimals)}
          symbol={symbol}
        />
      </span>

      <span className="leading-4 text12Medium text-textTertiary">
        <FiatPriceLabel free={balance} />
      </span>
    </LoadableContent>
  );
}

export default React.memo(Balance);
