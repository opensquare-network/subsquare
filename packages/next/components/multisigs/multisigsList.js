import useWindowSize from "next-common/utils/hooks/useWindowSize";
import isNil from "lodash.isnil";
import DesktopList from "./desktop";
import MobileList from "./mobile";
import { ListCard } from "components/myvotes/styled";
import Pagination from "next-common/components/pagination";
import { useDispatch } from "react-redux";
import { useChain } from "next-common/context/chain";
import { useCallback, useEffect, useState } from "react";
import { fetchMyMultisigs } from "next-common/store/reducers/multisigSlice";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function MultisigsList() {
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const chain = useChain();
  const realAddress = useRealAddress();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!realAddress) {
      return;
    }
    dispatch(
      fetchMyMultisigs(
        chain,
        "1431TrfW3CxDyFSDuCSjxsMki9iF8ecMjW366LcSJZdveZYG",
        page,
      ),
    );
  }, [dispatch, chain, page, realAddress]);

  const onPageChange = useCallback((e, page) => {
    e.preventDefault();
    e.stopPropagation();
    setPage(page);
  }, []);

  if (isNil(width)) {
    return null;
  }

  return (
    <ListCard>
      {width > 1024 ? <DesktopList /> : <MobileList />}
      <Pagination page={page} onPageChange={onPageChange} />
    </ListCard>
  );
}
