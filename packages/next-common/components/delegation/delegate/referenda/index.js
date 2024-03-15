import { useDispatch, useSelector } from "react-redux";
import {
  fetchReferendaDelegates,
  referendaDelegatesSelector,
  referendaDelegatesTriggerUpdateSelector,
} from "next-common/store/reducers/referenda/delegates";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useEffect } from "react";
import DelegatesLoadable from "next-common/components/delegation/delegate/common/loadable";
import DelegateEmpty from "next-common/components/delegation/delegate/common/empty";
import Delegates from "next-common/components/delegation/delegate/referenda/members";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

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
  const triggerUpdate = useSelector(referendaDelegatesTriggerUpdateSelector);

  useEffect(() => {
    dispatch(fetchReferendaDelegates(page, pageSize));
  }, [page, pageSize, triggerUpdate]);

  return (
    <>
      <TitleContainer>
        <span>
          List
          {!!total && (
            <span className="text-textTertiary text14Medium ml-1">{total}</span>
          )}
        </span>
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
