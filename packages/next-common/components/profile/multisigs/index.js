import { usePageProps } from "next-common/context/page";
import { useCallback, useEffect, useState } from "react";
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
import Pagination from "next-common/components/pagination";
import useWindowSize from "next-common/utils/hooks/useWindowSize";

function Multisigs() {
  const { width } = useWindowSize();
  const { id } = usePageProps();
  const chain = useChain();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const profileMultisigs = useSelector(profileMultisigsSelector);
  const {
    items: multisigs = [],
    pageSize = 1,
    total = 0,
  } = profileMultisigs || {};
  const isLoading = profileMultisigs === null;

  useEffect(() => {
    if (!isPolkadotAddress(id)) {
      return;
    }

    // todo: convert id to substrate address
    dispatch(fetchProfileMultisigs(chain, id, page));
  }, [dispatch, chain, page, id]);

  const onPageChange = useCallback((e, page) => {
    e.preventDefault();
    e.stopPropagation();
    setPage(page);
  }, []);

  return (
    <ListCard>
      {width > 1024 ? (
        <DesktopList multisigs={multisigs} isLoading={isLoading} />
      ) : (
        <MobileList multisigs={multisigs} isLoading={isLoading} />
      )}
      <Pagination
        page={page}
        onPageChange={onPageChange}
        total={total}
        pageSize={pageSize}
      />
    </ListCard>
  );
}

export default function ProfileMultisigs() {
  return (
    <WithPageWidth>
      <Multisigs />
    </WithPageWidth>
  );
}
