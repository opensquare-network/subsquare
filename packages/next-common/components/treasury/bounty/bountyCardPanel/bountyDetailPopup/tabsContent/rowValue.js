import React from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";

function RowValue({ value = 0 }) {
  const { symbol, decimals } = useChainSettings();
  if (isNil(value)) return null;

  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

export default React.memo(RowValue);
