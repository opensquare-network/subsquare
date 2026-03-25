import React from "react";
import useSubAddressBalanceWithPapi from "next-common/utils/hooks/useSubAddressBalanceWithPapi";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import PriceDisplay from "next-common/components/summary/treasurySummary/priceDisplay";

function Balance({ address }) {
  const { balance, isLoading } = useSubAddressBalanceWithPapi(address);

  if (isNil(balance)) return null;

  return (
    <LoadableContent isLoading={isLoading}>
      <PriceDisplay value={balance} className="!ml-0" />
    </LoadableContent>
  );
}

export default React.memo(Balance);
