import { useDispatch, useSelector } from "react-redux";
import {
  fetchReferendaDelegates,
  referendaDelegatesSelector,
} from "next-common/store/reducers/referenda/delegates";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useEffect } from "react";
import DelegatesLoadable from "next-common/components/delegation/delegate/common/loadable";
import DelegateEmpty from "next-common/components/delegation/delegate/common/empty";
import Delegates from "next-common/components/delegation/delegate/referenda/members";

export default function ReferendaDelegates() {
  const dispatch = useDispatch();
  const referendaDelegatesPageData = useSelector(referendaDelegatesSelector);
  const {
    items: delegates = [],
    pageSize = 18,
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
    <div className="mt-4">
      <DelegatesLoadable delegates={referendaDelegatesPageData}>
        {delegates <= 0 ? (
          <DelegateEmpty />
        ) : (
          <Delegates delegates={delegates} />
        )}

        <div className="mt-2">{pageComponent}</div>
      </DelegatesLoadable>
    </div>
  );
}
