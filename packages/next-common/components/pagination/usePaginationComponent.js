import { useCallback, useEffect, useState } from "react";
import Pagination from "next-common/components/pagination/index";
import { useRouter } from "next/router";

export default function usePaginationComponent(total, pageSize = 10) {
  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page || 1));
  useEffect(() => {
    setPage(parseInt(router.query.page || 1));
  }, [router.query.page]);

  const onPageChange = useCallback((e, page) => {
    e.preventDefault();
    e.stopPropagation();
    setPage(page);
  }, []);

  const component = (
    <Pagination
      page={page}
      onPageChange={onPageChange}
      total={total}
      pageSize={pageSize}
    />
  );

  return { page, setPage, component };
}
