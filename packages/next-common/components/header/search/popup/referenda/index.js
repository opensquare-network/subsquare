import { memo } from "react";
import CommonList from "next-common/components/header/search/common/commonList";
import { MenuReferenda } from "@osn/icons/subsquare";

const ReferendaItem = memo(function ItemContent({ row }) {
  const { index, title, content } = row;
  return (
    <div className="border-0! flex  hover:bg-neutral200 h-[60px] px-2 py-2 ">
      <p>
        <MenuReferenda className="w-6 h-6" />
      </p>
      <p className="pl-2 flex flex-col  justify-between">
        <span className="text14Medium text-textPrimary line-clamp-1">
          {`#${index}`} {title}
        </span>
        <span className="text12Medium text-textTertiary line-clamp-1">
          {content}
        </span>
      </p>
    </div>
  );
});

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
