import { useEffect, useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useCoretimeQuery } from "next-common/hooks/apollo";
import { GET_MY_CORETIME_PAID_CORES } from "next-common/services/gql/coretime/consts";
import { useContextPapiApi } from "next-common/context/papi";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useRegions from "next-common/components/coretime/regions/useRegions";
import useCoretimeRenewalInfo from "next-common/components/coretime/cores/hooks/useCoretimeRenewalInfo";
import { buildMyCoretimeSummary, collectPaidCores } from "./utils";

// The indexer caps the page size at 100, which is far above the amount of
// purchases (max. ~20) and renewals (max. ~40) of a single sale.
const SALE_CORES_LIMIT = 100;

function formatContributionEntry({ args, value }) {
  const [regionId] = args ?? [];
  return {
    core: Number(regionId?.core),
    payee: value?.payee,
  };
}

export default function useMyCoretime() {
  const api = useContextPapiApi();
  const address = useRealAddress();
  const sale = useCoretimeSale();
  const saleId = sale?.id;
  const regionBegin = sale?.info?.regionBegin;
  const regionLength = sale?.configuration?.regionLength;
  const hasPreviousSale = !isNil(saleId) && saleId > 1;

  const { regions, loading: isRegionsLoading } = useRegions();
  const {
    renewalByCore,
    autoRenewByCore,
    loading: isRenewalInfoLoading,
  } = useCoretimeRenewalInfo();
  const [contributions, setContributions] = useState([]);
  const [isContributionsLoading, setContributionsLoading] = useState(true);

  // Renewed cores leave no region behind, so cores paid for are collected from
  // the sale events of the current and of the previous sale.
  const { data: saleCores, loading: isSaleCoresLoading } = useCoretimeQuery(
    GET_MY_CORETIME_PAID_CORES,
    {
      skip: isNil(saleId),
      variables: {
        saleId: saleId ?? 0,
        prevSaleId: hasPreviousSale ? saleId - 1 : 0,
        hasPrevSale: hasPreviousSale,
        limit: SALE_CORES_LIMIT,
      },
    },
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    const subscription =
      api.query.Broker.InstaPoolContribution.watchEntries().subscribe({
        next: ({ entries }) => {
          setContributionsLoading(false);
          setContributions((entries ?? []).map(formatContributionEntry));
        },
        error: (error) => {
          console.error("Failed to watch coretime pool contributions:", error);
          setContributions([]);
          setContributionsLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [api]);

  const paidCores = useMemo(() => {
    if (isNil(regionBegin) || isNil(regionLength)) {
      return [];
    }

    return collectPaidCores({
      renewals: [
        ...(saleCores?.renewals?.items ?? []),
        ...(saleCores?.prevRenewals?.items ?? []),
      ],
      purchases: [
        ...(saleCores?.purchases?.items ?? []),
        ...(saleCores?.prevPurchases?.items ?? []),
      ],
      address,
      begins: [regionBegin, regionBegin - regionLength],
    });
  }, [saleCores, address, regionBegin, regionLength]);

  const summary = useMemo(
    () =>
      buildMyCoretimeSummary({
        regions,
        contributions,
        paidCores,
        renewalByCore,
        autoRenewByCore,
        address,
      }),
    [
      regions,
      contributions,
      paidCores,
      renewalByCore,
      autoRenewByCore,
      address,
    ],
  );

  return {
    summary,
    loading:
      isRegionsLoading ||
      isRenewalInfoLoading ||
      isContributionsLoading ||
      isSaleCoresLoading,
  };
}
