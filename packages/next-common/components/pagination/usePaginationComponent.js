import { useCallback, useState } from "react";
import Pagination from "next-common/components/pagination/index";

export default function usePaginationComponent(total, pageSize = 10) {
  const [page, setPage] = useState(1);

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

  return { page, component };
}
