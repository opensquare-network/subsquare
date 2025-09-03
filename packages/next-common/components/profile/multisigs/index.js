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
import { CallPopupProvider } from "next-common/components/multisigs/context/callPopupContext";
import { CallPopupInContext } from "next-common/components/multisigs/callPopup";
import { fetchMultisigData } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import { useAsync } from "react-use";
import Loading from "next-common/components/loading";
import MultisigSummary from "next-common/components/profile/multisigs/summary";
import MultisigsTabs from "next-common/components/profile/multisigs/tabs";

function MultisigAddressPage({ threshold, signatories }) {
  return (
    <div className="flex flex-col gap-[18px]">
      <MultisigSummary threshold={threshold} signatories={signatories} />
      <MultisigsTabs />
    </div>
  );
}

function NonMultisigAddressPage() {
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

  return (
    <ListCard>
      {width > 1024 ? (
        <DesktopList multisigs={multisigs} isLoading={isLoading} />
      ) : (
        <MobileList multisigs={multisigs} isLoading={isLoading} />
      )}
      {pageComponent}
      <CallPopupInContext />
    </ListCard>
  );
}

function Multisigs() {
  const address = useProfileAddress();

  const { value: multisigData, loading: multisigLoading } = useAsync(
    async () => await fetchMultisigData(address),
    [address],
  );

  if (multisigLoading) {
    return (
      <div className="flex grow mt-2 justify-center items-center">
        <Loading size={20} />
      </div>
    );
  }

  if (multisigData && multisigData.signatories?.length > 0) {
    return (
      <MultisigAddressPage
        threshold={multisigData.threshold}
        signatories={multisigData.signatories}
      />
    );
  }

  return <NonMultisigAddressPage />;
}

export default function ProfileMultisigs() {
  return (
    <WithPageWidth>
      <CallPopupProvider>
        <Multisigs />
      </CallPopupProvider>
    </WithPageWidth>
  );
}
