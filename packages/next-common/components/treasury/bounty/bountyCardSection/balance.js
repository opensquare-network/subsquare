import React from "react";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import PriceDisplay from "next-common/components/summary/treasurySummary/priceDisplay";

function Balance({ address }) {
  const { balance, isLoading } = useSubAddressBalance(address);

  if (isNil(balance)) return null;

  return (
    <LoadableContent isLoading={isLoading}>
      <PriceDisplay value={balance} className="!ml-0" />
    </LoadableContent>
  );
}

export default React.memo(Balance);
