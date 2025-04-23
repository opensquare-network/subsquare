import { memo } from "react";
import CommonList, {
  SearchType,
  getPathAndCategoryByItemData,
} from "next-common/components/header/search/common/commonList";
import {
  MenuReferenda,
  MenuDemocracy,
  MenuBounties,
  MenuChildBounties,
} from "@osn/icons/subsquare";
import Link from "next/link";

const SearchItem = memo(function ItemContent({ row, onClose }) {
  const { index, title, content, type } = row;
  const { path, category } = getPathAndCategoryByItemData(row);

  return (
    <Link
      href={path}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onClose?.();
      }}
    >
      {index === -Infinity ? (
        <div className="h-9 px-4 py-2.5 rounded-[6px] flex items-center text12Medium text-textTertiary">
          {category}
        </div>
      ) : (
        <div
          className={`border-0! flex  hover:bg-neutral200 px-2 py-2 rounded-[6px] ${
            content === "-" ? "h-[40px] items-center" : "h-[60px]"
          }`}
        >
          <p>
            {type === SearchType.REFERENDA && (
              <MenuReferenda className="w-6 h-6 [&_path]:fill-textTertiary" />
            )}
            {type === SearchType.DEMOCRACY_REFERENDA && (
              <MenuDemocracy className="w-6 h-6 [&_path]:fill-textTertiary" />
            )}
            {type === SearchType.BOUNTIES && (
              <MenuBounties className="w-6 h-6 [&_path]:fill-textTertiary" />
            )}
            {type === SearchType.CHILD_BOUNTIES && (
              <MenuChildBounties className="w-6 h-6 [&_path]:fill-textTertiary" />
            )}
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
            {content !== "-" && (
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
            )}
          </p>
        </div>
      )}
    </Link>
  );
});

function SearchList({ data, isLoading, onClose, isMobile }) {
  return (
    <CommonList
      isMobile={isMobile}
      data={data}
      isLoading={isLoading}
      ItemBox={(props) => <SearchItem {...props} onClose={onClose} />}
      onClose={onClose}
    />
  );
}

export default memo(SearchList);
