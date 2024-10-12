import { useEffect, useCallback } from "react";
import { useChain } from "next-common/context/chain";
import {
  fetchProfileMultisigs,
  profileMultisigsSelector,
} from "next-common/store/reducers/profile/multisig";
import { useDispatch, useSelector } from "react-redux";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import WithPageWidth from "next-common/components/common/withPageWidth";
import { ListCard } from "next-common/components/overview/styled";
import DesktopList from "next-common/components/multisigs/desktop";
import MobileList from "next-common/components/multisigs/mobile";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import {
  MultisigContextProvider,
  useMultisigContext,
} from "next-common/components/multisigs/multisigContext";

function Multisigs() {
  const { width } = useWindowSize();
  const address = useProfileAddress();
  const chain = useChain();
  const dispatch = useDispatch();
  const profileMultisigs = useSelector(profileMultisigsSelector);
  const {
    items: multisigs = [],
    pageSize = 15,
    total = 0,
  } = profileMultisigs || {};
  const isLoading = profileMultisigs === null;

  const { page, component: pageComponent } = usePaginationComponent(
    total,
    pageSize,
  );
  const { isNeedReload, setIsNeedReload } = useMultisigContext();

  const fetchProfileMultisigsData = useCallback(() => {
    if (!isPolkadotAddress(address)) {
      return;
    }

    // todo: convert id to substrate address
    dispatch(fetchProfileMultisigs(chain, address, page));
  }, [dispatch, chain, page, address]);

  useEffect(() => {
    fetchProfileMultisigsData();
  }, [fetchProfileMultisigsData]);

  useEffect(() => {
    if (isNeedReload) {
      fetchProfileMultisigsData();
      setIsNeedReload(false);
    }
  }, [isNeedReload, setIsNeedReload, fetchProfileMultisigsData]);

  return (
    <ListCard>
      {width > 1024 ? (
        <DesktopList multisigs={multisigs} isLoading={isLoading} />
      ) : (
        <MobileList multisigs={multisigs} isLoading={isLoading} />
      )}
      {pageComponent}
    </ListCard>
  );
}

export default function ProfileMultisigs() {
  return (
    <MultisigContextProvider>
      <WithPageWidth>
        <Multisigs />
      </WithPageWidth>
    </MultisigContextProvider>
  );
}
