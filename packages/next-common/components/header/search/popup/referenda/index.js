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
          <MenuReferenda className="w-6 h-6 [&_path]:fill-textTertiary" />
        </p>
        <p className="pl-2 flex flex-col justify-between min-w-0 flex-1">
          <span
            className="text14Medium text-textPrimary"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {`#${index}`}&nbsp;·&nbsp;{title}
          </span>
          <span
            className="text12Medium text-textTertiary"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {content}
          </span>
        </p>
      </div>
    </Link>
  );
});

function ReferendaList({ data, isLoading, onClose, isMobile }) {
  return (
    <CommonList
      isMobile={isMobile}
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
