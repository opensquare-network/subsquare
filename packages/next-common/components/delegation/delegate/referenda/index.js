import { useDispatch, useSelector } from "react-redux";
import {
  fetchReferendaDelegates,
  referendaDelegatesSelector,
} from "next-common/store/reducers/referenda/delegates";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useEffect } from "react";

export default function ReferendaDelegates() {
  const dispatch = useDispatch();
  const referendaDelegatesPageData = useSelector(referendaDelegatesSelector);
  const {
    items: delegates = [],
    pageSize = 25,
    total = 0,
  } = referendaDelegatesPageData || {};
  const { page, component: pageComponent } = usePaginationComponent(
    total,
    pageSize,
  );

  useEffect(() => {
    dispatch(fetchReferendaDelegates(page, pageSize));
  }, [page, pageSize]);

  return (
    <div>
      delegates length: {delegates.length}
      {pageComponent}
    </div>
  );
}
