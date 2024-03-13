import { useChain } from "next-common/context/chain";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useEffect, useState } from "react";
import TransferList from "./list";
import Pagination from "next-common/components/pagination";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

const DEFAULT_PAGE_SIZE = 25;

export default function ProfileTransfers() {
  const chain = useChain();
  const address = useProfileAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!address) {
      return;
    }

    setIsLoading(true);
    fetch(`https://${chain}-api.statescan.io/accounts/${address}/transfers`, {
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => setData(result))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [address, chain, page]);

  return (
    <SecondaryCard>
      <TransferList isLoading={isLoading} items={data?.items} />
      <Pagination
        page={page}
        pageSize={DEFAULT_PAGE_SIZE}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          setPage(page);
        }}
        total={data?.total || 0}
      />
    </SecondaryCard>
  );
}
