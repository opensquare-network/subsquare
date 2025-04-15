import React from "react";
import DataList from "next-common/components/dataList";

function CommonList({ data, isLoading, title, ItemBox }) {
  return (
    <div className="pt-2">
      <p className="h-9 pl-4 flex items-center text12Medium text-textTertiary">
        {title}
      </p>
      <DataList
        columns={[]}
        rows={data}
        loading={isLoading}
        renderItem={(DataListItem, idx, rows) => <ItemBox row={rows[idx]} />}
        className="max-h-[450px] overflow-auto"
        contentClassName="border-0 divide-y-0"
        titleClassName="border-0 pb-0"
      />
    </div>
  );
}

export default React.memo(CommonList);
