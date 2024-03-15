import { useDispatch, useSelector } from "react-redux";
import {
  fetchDemocracyDelegates,
  democracyDelegatesSelector,
  democracyDelegatesTriggerUpdateSelector,
} from "next-common/store/reducers/democracy/delegates";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useEffect } from "react";
import DelegatesLoadable from "next-common/components/delegation/delegate/common/loadable";
import DelegateEmpty from "next-common/components/delegation/delegate/common/empty";
import Delegates from "./members";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function DemocracyDelegates() {
  const dispatch = useDispatch();
  const democracyDelegatesPageData = useSelector(democracyDelegatesSelector);
  const {
    items: delegates = [],
    pageSize = 18,
    total = 0,
  } = democracyDelegatesPageData || {};
  const { page, component: pageComponent } = usePaginationComponent(
    total,
    pageSize,
  );
  const triggerUpdate = useSelector(democracyDelegatesTriggerUpdateSelector);

  useEffect(() => {
    dispatch(fetchDemocracyDelegates(page, pageSize));
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

      <DelegatesLoadable delegates={democracyDelegatesPageData}>
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
