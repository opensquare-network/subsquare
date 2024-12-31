import NoData from "next-common/components/noData";
import DemocracyNewDelegation from "next-common/components/summary/democracySummaryDelegation/newDelegation";
import nextApi from "next-common/services/nextApi";
import { delegationDemocracyDelegatesAddressApi } from "next-common/services/url";
import { useMemo, useState } from "react";
import { useDebounce } from "react-use";
import Delegates from "./members";
import DelegatesLoadable from "../common/loadable";
import { isNil } from "lodash-es";

export default function DemocracyDelegationSearchResult({
  searchAddress = "",
}) {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const delegates = useMemo(() => [result], [result]);

  useDebounce(
    () => {
      setIsLoading(true);
      setResult(null);

      nextApi
        .fetch(delegationDemocracyDelegatesAddressApi(searchAddress))
        .then((resp) => {
          if (resp.result) {
            setResult(resp.result);
          }
          if (resp.error) {
            setResult(null);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    500,
    [searchAddress],
  );

  if (isNil(result) && !isLoading) {
    return (
      <NoData
        text={
          <span>
            This address isn’t a delegate,{" "}
            <DemocracyNewDelegation
              defaultTargetAddress={searchAddress}
              className="border-none p-0 bg-transparent text-theme500"
              iconLeft={null}
            >
              Still Delegate
            </DemocracyNewDelegation>
          </span>
        }
      />
    );
  }

  return (
    <DelegatesLoadable delegates={result}>
      <Delegates delegates={delegates} />
    </DelegatesLoadable>
  );
}
