import NoData from "next-common/components/noData";
import NewDelegateButton from "next-common/components/summary/allDelegation/newDelegateButton";
import nextApi from "next-common/services/nextApi";
import { delegationReferendaDelegatesAddressApi } from "next-common/services/url";
import React, { useMemo, useState } from "react";
import { useDebounce } from "react-use";
import Delegates from "./members";
import DelegatesLoadable from "../common/loadable";
import { isNil } from "lodash-es";

export default function ReferendaDelegationSearchResult({
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
        .fetch(delegationReferendaDelegatesAddressApi(searchAddress))
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

  if ((isNil(result) && !isLoading) || !result?.address) {
    return (
      <NoData
        text={
          <span>
            This address isn’t a delegate,{" "}
            <NewDelegateButton
              defaultTargetAddress={searchAddress}
              className="border-none p-0 bg-transparent text-theme500"
              iconLeft={null}
            >
              Still Delegate
            </NewDelegateButton>
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
