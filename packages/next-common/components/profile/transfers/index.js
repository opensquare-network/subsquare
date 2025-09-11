import { useChain } from "next-common/context/chain";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useEffect, useState } from "react";
import TransferList from "./list";
import Pagination from "next-common/components/pagination";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import {
  profileTransfersSelector,
  setProfileTransfers,
} from "next-common/store/reducers/profile/transfer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useMountedState } from "react-use";

const DEFAULT_PAGE_SIZE = 25;

export default function ProfileTransfers() {
  const dispatch = useDispatch();
  const chain = useChain();
  const address = useProfileAddress();
  const transfers = useSelector(profileTransfersSelector);
  const [page, setPage] = useState(1);
  const isMounted = useMountedState();

  useEffect(() => {
    if (!address) {
      return;
    }

    fetch(
      `https://${chain}-api.statescan.io/accounts/${address}/transfers?page=${
        page - 1
      }&page_size=${DEFAULT_PAGE_SIZE}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        if (isMounted()) {
          dispatch(setProfileTransfers(result));
        }
      })
      .catch((error) => console.error(error));
  }, [address, chain, page, isMounted, dispatch]);

  return (
    <SecondaryCard>
      <TransferList isLoading={!transfers} items={transfers?.items} />
      <Pagination
        page={page}
        pageSize={transfers?.pageSize}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          setPage(page);
        }}
        total={transfers?.total || 0}
      />
    </SecondaryCard>
  );
}
