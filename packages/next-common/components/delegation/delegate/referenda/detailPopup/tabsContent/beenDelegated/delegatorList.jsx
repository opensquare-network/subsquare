import { useMemo, useState } from "react";
import DelegationList from "next-common/components/summary/democracyBeenDelegated/beenDelegatedListPopup/delegationList";
import Pagination from "next-common/components/pagination";

export default function DelegatorList({ delegators }) {
  const [detailListPage, setDetailListPage] = useState(1);

  const pageSize = 30;
  function onPageChange(e, newPage) {
    e.preventDefault();
    setDetailListPage(newPage);
  }
  const pagination = {
    page: detailListPage,
    pageSize,
    total: delegators?.length || 0,
    onPageChange,
  };
  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  const items = useMemo(() => {
    return delegators.slice(sliceFrom, sliceTo);
  }, [delegators, sliceFrom, sliceTo]);

  if (!delegators || delegators.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="mb-2 text14Bold text-textPrimary">Delegators</h4>
      <DelegationList items={items} />

      <div className="mt-2">
        <Pagination {...pagination} />
      </div>
    </div>
  );
}
