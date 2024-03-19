import { useDispatch, useSelector } from "react-redux";
import {
  fetchReferendaDelegates,
  referendaDelegatesSelector,
  referendaDelegatesTriggerUpdateSelector,
} from "next-common/store/reducers/referenda/delegates";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useEffect, useState } from "react";
import DelegatesLoadable from "next-common/components/delegation/delegate/common/loadable";
import DelegateEmpty from "next-common/components/delegation/delegate/common/empty";
import Delegates from "next-common/components/delegation/delegate/referenda/members";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DelegationSortSelect from "../common/sortSelect";
import { useRouter } from "next/router";
import { omit } from "lodash-es";

export default function ReferendaDelegates() {
  const dispatch = useDispatch();
  const router = useRouter();

  const referendaDelegatesPageData = useSelector(referendaDelegatesSelector);
  const {
    items: delegates = [],
    pageSize = 18,
    total = 0,
  } = referendaDelegatesPageData || {};
  const {
    page,
    setPage,
    component: pageComponent,
  } = usePaginationComponent(total, pageSize);
  const triggerUpdate = useSelector(referendaDelegatesTriggerUpdateSelector);
  const [sort, setSort] = useState(router.query.sort || "");

  useEffect(() => {
    const q = router.query;
    dispatch(fetchReferendaDelegates(q.sort || "", q.page || 1, pageSize));
  }, [router.asPath, triggerUpdate]);

  useEffect(() => {
    setSort(router.query.sort || "");
  }, [router.query.sort]);

  useEffect(() => {
    setPage(1);
  }, [sort]);

  useEffect(() => {
    const q = omit(router.query, ["sort", "page"]);
    if (page > 1) {
      q.page = page;
    }
    if (sort) {
      q.sort = sort;
    }

    router.push({ query: q }, null, { shallow: true });
  }, [sort, page, pageSize]);

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

      <DelegatesLoadable delegates={referendaDelegatesPageData}>
        {delegates <= 0 ? (
          <DelegateEmpty />
        ) : (
          <Delegates delegates={delegates} />
        )}

        <div className="mt-2">{pageComponent}</div>
      </DelegatesLoadable>
    </>
  );
}
