import { useState } from "react";
import DelegatesLoadable from "next-common/components/delegation/delegate/common/loadable";
import DelegateEmpty from "next-common/components/delegation/delegate/common/empty";
import Delegates from "./members";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DelegationSortSelect from "../common/sortSelect";
import { useRouter } from "next/router";
import { useDemocracyDelegatesContext } from "./useDemocracyDelegatesContext";
import DelegationSearchInput from "../common/searchInput";
import DemocracyNewDelegation from "next-common/components/summary/democracySummaryDelegation/newDelegation";
import { SystemPlus } from "@osn/icons/subsquare";
import DemocracyDelegationSearchResult from "./searchResult";

export default function DemocracyDelegates() {
  const router = useRouter();

  const { democracyDelegatesPageData, pageComponent } =
    useDemocracyDelegatesContext();
  const { items: delegates = [], total = 0 } = democracyDelegatesPageData || {};
  const [sort, setSort] = useState(router.query.sort || "");
  const [searchAddress, setSearchAddress] = useState("");

  return (
    <>
      <TitleContainer>
        <span>
          List
          {!!total && (
            <span className="text-textTertiary text14Medium ml-1">{total}</span>
          )}
        </span>

        <DelegationSortSelect sort={sort} setSort={setSort} />
      </TitleContainer>

      <div className="px-6">
        <DelegationSearchInput
          address={searchAddress}
          setAddress={setSearchAddress}
          delegateButton={
            <DemocracyNewDelegation
              defaultTargetAddress={searchAddress}
              size="large"
              iconLeft={<SystemPlus />}
            />
          }
        />
      </div>

      {searchAddress ? (
        <DemocracyDelegationSearchResult searchAddress={searchAddress} />
      ) : (
        <DelegatesLoadable delegates={democracyDelegatesPageData}>
          {delegates <= 0 ? (
            <DelegateEmpty />
          ) : (
            <Delegates delegates={delegates} />
          )}

          <div className="mt-2">{pageComponent}</div>
        </DelegatesLoadable>
      )}
    </>
  );
}
