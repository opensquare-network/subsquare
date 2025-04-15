import { memo } from "react";
import { MapDataList } from "next-common/components/dataList";

// eslint-disable-next-line no-unused-vars
export const ItemContent = memo(function ItemContent({ item }) {
  return (
    <div className="border-0! hover:bg-neutral200 h-[60px] px-2">
      <span> 123 </span>
      <span> 456 </span>
    </div>
  );
});

function ReferendaList({ data, isLoading }) {
  return (
    <MapDataList
      data={data}
      loading={isLoading}
      renderItem={(item) => <ItemContent item={item} />}
      // noDataText="No members can be demoted."
      className="max-h-[450px] overflow-auto"
      contentClassName="border-0 divide-y-0"
      titleClassName="border-0"
    />
  );
}

export default memo(ReferendaList);
