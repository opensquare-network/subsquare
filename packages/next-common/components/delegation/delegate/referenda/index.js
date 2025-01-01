import { useEffect, useState } from "react";
import Delegates from "next-common/components/delegation/delegate/referenda/members";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DelegationSortSelect from "../common/sortSelect";
import { useRouter } from "next/router";
import ReferendaDelegationSearchResult from "./searchResult";
import { useReferendaDelegatesData } from "./useReferendaDelegatesData";
import DelegatesLoadable from "../common/loadable";
import DelegateEmpty from "../common/empty";
import DelegationSearchInput from "../common/searchInput";
import NewDelegateButton from "next-common/components/summary/allDelegation/newDelegateButton";
import { SystemPlus } from "@osn/icons/subsquare";
import Pagination from "next-common/components/pagination";

export default function ReferendaDelegates() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(router.query.sort || "");
  const [searchAddress, setSearchAddress] = useState("");
  const referendaDelegatesPageData = useReferendaDelegatesData({ page, sort });
  const {
    items: delegates = [],
    total = 0,
    pageSize,
  } = referendaDelegatesPageData || {};

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
            <NewDelegateButton
              defaultTargetAddress={searchAddress}
              size="large"
              iconLeft={<SystemPlus />}
            />
          }
        />
      </div>

      {searchAddress ? (
        <ReferendaDelegationSearchResult searchAddress={searchAddress} />
      ) : (
        <DelegatesLoadable delegates={referendaDelegatesPageData}>
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
