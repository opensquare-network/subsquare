import useWindowSize from "next-common/utils/hooks/useWindowSize";
import DesktopList from "./desktop";
import MobileList from "./mobile";
import Pagination from "next-common/components/pagination";
import { useDispatch, useSelector } from "react-redux";
import { useChain } from "next-common/context/chain";
import { useCallback, useEffect, useState } from "react";
import {
  fetchMyMultisigs,
  multisigsIsLoadingSelector,
  myMultisigsSelector,
} from "next-common/store/reducers/multisigSlice";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { ListCard } from "next-common/components/overview/styled";

export default function MultisigsList() {
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const chain = useChain();
  const realAddress = useRealAddress();
  const [page, setPage] = useState(1);
  const myMultisigs = useSelector(myMultisigsSelector);
  const { pageSize = 1, total = 0 } = myMultisigs || {};
  const isLoading = useSelector(multisigsIsLoadingSelector);

  useEffect(() => {
    if (!realAddress) {
      return;
    }
    dispatch(fetchMyMultisigs(chain, realAddress, page));
  }, [dispatch, chain, page, realAddress]);

  const onPageChange = useCallback((e, page) => {
    e.preventDefault();
    e.stopPropagation();
    setPage(page);
  }, []);

  return (
    <ListCard>
      {width > 1024 ? (
        <DesktopList multisigs={myMultisigs?.items} isLoading={isLoading} />
      ) : (
        <MobileList multisigs={myMultisigs?.items} isLoading={isLoading} />
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
