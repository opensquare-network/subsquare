import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  fetchReferendaDelegates,
  referendaDelegatesSelector,
  referendaDelegatesTriggerUpdateSelector,
} from "next-common/store/reducers/referenda/delegates";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { omit } from "lodash-es";

export function useReferendaDelegatesContext() {
  const dispatch = useDispatch();
  const router = useRouter();

  const referendaDelegatesPageData = useSelector(referendaDelegatesSelector);
  const { pageSize = 18, total = 0 } = referendaDelegatesPageData || {};
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

  return {
    referendaDelegatesPageData,
    pageComponent,
  };
}
