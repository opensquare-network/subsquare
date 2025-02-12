import {
  Democracy,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import nextApi from "next-common/services/nextApi";
import {
  delegationDemocracyDelegatesAddressApi,
  delegationReferendaDelegatesAddressApi,
} from "next-common/services/url";
import {
  democracyDelegatesTriggerUpdateSelector,
  democracyMyDelegateSelector,
  setDemocracyMyDelegate,
} from "next-common/store/reducers/democracy/delegates";
import {
  referendaDelegatesTriggerUpdateSelector,
  referendaMyDelegateSelector,
  setReferendaMyDelegate,
} from "next-common/store/reducers/referenda/delegates";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAsync } from "react-use";

function useGetAddressDelegationApiPath(realAddress) {
  const moduleTab = useModuleTab();

  if (moduleTab === Referenda) {
    return delegationReferendaDelegatesAddressApi(realAddress);
  } else if (moduleTab === Democracy) {
    return delegationDemocracyDelegatesAddressApi(realAddress);
  } else {
    throw new Error("Invalid module tab");
  }
}

function useRefreshDataTrigger() {
  const moduleTab = useModuleTab();
  const democracyTriggerUpdate = useSelector(
    democracyDelegatesTriggerUpdateSelector,
  );
  const referendaTriggerUpdate = useSelector(
    referendaDelegatesTriggerUpdateSelector,
  );

  if (moduleTab === Referenda) {
    return referendaTriggerUpdate;
  } else if (moduleTab === Democracy) {
    return democracyTriggerUpdate;
  } else {
    throw new Error("Invalid module tab");
  }
}

export default function useAddressDelegation(address) {
  const apiPath = useGetAddressDelegationApiPath(address);
  const triggerUpdate = useRefreshDataTrigger();
  return useAsync(async () => {
    if (!address) {
      return null;
    }
    return await nextApi.fetch(apiPath).then((resp) => {
      if (resp.result) {
        return resp.result;
      }
    });
  }, [apiPath, triggerUpdate]);
}

export function useMyReferendaDelegation() {
  const dispatch = useDispatch();
  const realAddress = useRealAddress();
  const triggerUpdate = useSelector(referendaDelegatesTriggerUpdateSelector);
  const myDelegate = useSelector(referendaMyDelegateSelector);

  useEffect(() => {
    if (!realAddress) {
      return;
    }
    nextApi
      .fetch(delegationReferendaDelegatesAddressApi(realAddress))
      .then((resp) => {
        if (resp.result) {
          dispatch(setReferendaMyDelegate(resp.result));
        }
      });
  }, [dispatch, realAddress, triggerUpdate]);

  return myDelegate;
}

export function useMyDemocracyDelegation() {
  const dispatch = useDispatch();
  const realAddress = useRealAddress();
  const triggerUpdate = useSelector(democracyDelegatesTriggerUpdateSelector);
  const myDelegate = useSelector(democracyMyDelegateSelector);

  useEffect(() => {
    if (!realAddress) {
      return;
    }
    nextApi
      .fetch(delegationDemocracyDelegatesAddressApi(realAddress))
      .then((resp) => {
        if (resp.result) {
          dispatch(setDemocracyMyDelegate(resp.result));
        }
      });
  }, [dispatch, realAddress, triggerUpdate]);

  return myDelegate;
}
