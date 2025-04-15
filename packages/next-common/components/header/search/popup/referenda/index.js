import { memo } from "react";
import DataList from "next-common/components/dataList";
import { MenuReferenda } from "@osn/icons/subsquare";

const ReferendaItem = memo(function ItemContent({ row }) {
  const { index, title, content } = row;
  return (
    <div className="border-0! flex  hover:bg-neutral200 h-[60px] px-2 py-2 ">
      <p>
        <MenuReferenda className="w-6 h-6" />
      </p>
      <p className="pl-2 flex flex-col  justify-between">
        <span className="text14Medium text-textPrimary">
          {`#${index}`} {title}
        </span>
        <span className="text12Medium text-textTertiary">{content}</span>
      </p>
    </div>
  );
});

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

function ReferendaList({ data, isLoading }) {
  return (
    <CommonList
      data={data}
      isLoading={isLoading}
      title="Referenda"
      ItemBox={ReferendaItem}
    />
  );
}

export default memo(ReferendaList);
