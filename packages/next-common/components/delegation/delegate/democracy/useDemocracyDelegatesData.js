import { useDispatch, useSelector } from "react-redux";
import {
  fetchDemocracyDelegates,
  democracyDelegatesSelector,
  democracyDelegatesTriggerUpdateSelector,
} from "next-common/store/reducers/democracy/delegates";
import { useEffect } from "react";
import { useRouter } from "next/router";
// import { omit } from "lodash-es";

export function useDemocracyDelegatesData({
  // page,
  // sort,
  pageSize = 18,
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const democracyDelegatesPageData = useSelector(democracyDelegatesSelector);

  const triggerUpdate = useSelector(democracyDelegatesTriggerUpdateSelector);

  useEffect(() => {
    const q = router.query;
    dispatch(fetchDemocracyDelegates(q.sort || "", q.page || 1, pageSize));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, triggerUpdate]);

  // useEffect(() => {
  //   const q = omit(router.query, ["sort", "page"]);
  //   if (page > 1) {
  //     q.page = page;
  //   }
  //   if (sort) {
  //     q.sort = sort;
  //   }

  //   router.push({ query: q }, null, { shallow: true });
  // }, [sort, page, pageSize, router]);

  return democracyDelegatesPageData;
}
