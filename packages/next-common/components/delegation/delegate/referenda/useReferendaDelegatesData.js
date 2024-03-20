import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  fetchReferendaDelegates,
  referendaDelegatesSelector,
  referendaDelegatesTriggerUpdateSelector,
} from "next-common/store/reducers/referenda/delegates";
import { omit } from "lodash-es";

export function useReferendaDelegatesData({ page, sort, pageSize = 18 }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const referendaDelegatesPageData = useSelector(referendaDelegatesSelector);

  const triggerUpdate = useSelector(referendaDelegatesTriggerUpdateSelector);

  useEffect(() => {
    const q = router.query;
    dispatch(fetchReferendaDelegates(q.sort || "", q.page || 1, pageSize));
  }, [router.asPath, triggerUpdate]);

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

  return referendaDelegatesPageData;
}
