import Loading from "next-common/components/loading";
import { noop } from "lodash-es";
import { Item } from "next-common/components/actions/styled";
import { ArrowDown, SystemThumbUp } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function ThumbsUp({
  disabled = false,
  count = 0,
  noHover = false,
  highlight = false,
  thumbUpLoading = false,
  toggleThumbUp = noop,
  showThumbsUpList = false,
  setShowThumbsUpList = noop,
}) {
  return (
    <div className="flex items-center">
      <Item
        noHover={noHover}
        highlight={highlight}
        onClick={() => toggleThumbUp()}
      >
        {thumbUpLoading ? (
          <Loading size={14} />
        ) : (
          <SystemThumbUp
            className={cn("w-5 h-5", disabled && "[&_path]:fill-textDisabled")}
          />
        )}
        <div>Up{count > 0 ? ` ${count}` : ""}</div>
      </Item>
      {count > 0 && (
        <ArrowDown
          role="button"
          onClick={() => setShowThumbsUpList(!showThumbsUpList)}
          className={cn(
            "w-5 h-5 ml-1",
            "[&_path]:!fill-none [&_path]:stroke-textTertiary",
            showThumbsUpList && "rotate-180",
          )}
        />
      )}
    </div>
  );
}
