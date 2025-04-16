import { memo } from "react";
import CommonList, {
  SearchType,
} from "next-common/components/header/search/common/commonList";
import { MenuReferenda } from "@osn/icons/subsquare";
import Link from "next/link";

const ReferendaItem = memo(function ItemContent({ row, searchType, onClose }) {
  const { index, title, content } = row;
  return (
    <Link
      href={`/${searchType}/${index}`}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onClose?.();
      }}
    >
      <div className="border-0! flex  hover:bg-neutral200 h-[60px] px-2 py-2">
        <p>
          <MenuReferenda className="w-6 h-6" />
        </p>
        <p className="pl-2 flex flex-col  justify-between">
          <span className="text14Medium text-textPrimary line-clamp-1">
            {`#${index}`}&nbsp;·&nbsp;{title}
          </span>
          <span className="text12Medium text-textTertiary line-clamp-1">
            {content}
          </span>
        </p>
      </div>
    </Link>
  );
});

function ReferendaList({ data, isLoading, onClose }) {
  return (
    <CommonList
      data={data}
      isLoading={isLoading}
      title="Referenda"
      ItemBox={(props) => (
        <ReferendaItem
          {...props}
          searchType={SearchType.REFERENDA}
          onClose={onClose}
        />
      )}
      searchType={SearchType.REFERENDA}
      onClose={onClose}
    />
  );
}

export default memo(ReferendaList);
