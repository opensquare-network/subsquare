import { useEffect, useState } from "react";
import DelegatesLoadable from "next-common/components/delegation/delegate/common/loadable";
import DelegateEmpty from "next-common/components/delegation/delegate/common/empty";
import Delegates from "./members";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DelegationSortSelect from "../common/sortSelect";
import { useRouter } from "next/router";
import { useDemocracyDelegatesData } from "./useDemocracyDelegatesData";
import DelegationSearchInput from "../common/searchInput";
import DemocracyNewDelegation from "next-common/components/summary/democracySummaryDelegation/newDelegation";
import { SystemPlus } from "@osn/icons/subsquare";
import DemocracyDelegationSearchResult from "./searchResult";
import Pagination from "next-common/components/pagination";

export default function DemocracyDelegates() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(router.query.sort || "");
  const [searchAddress, setSearchAddress] = useState("");
  const democracyDelegatesPageData = useDemocracyDelegatesData({ page, sort });
  const {
    items: delegates = [],
    total = 0,
    pageSize,
  } = democracyDelegatesPageData || {};

  useEffect(() => {
    setSort(router.query.sort || "");
  }, [router.query.sort]);

  useEffect(() => {
    setPage(1);
  }, [sort]);

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
            <Delegates page={page} delegates={delegates} />
          )}

          <div className="mt-2">
            <Pagination
              page={page}
              setPage={setPage}
              total={total}
              pageSize={pageSize}
              onPageChange={(event, page) => {
                event.preventDefault();
                event.stopPropagation();
                setPage(page);
              }}
            />
          </div>
        </DelegatesLoadable>
      )}
    </>
  );
}
