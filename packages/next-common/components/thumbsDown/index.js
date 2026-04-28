import Loading from "../loading";
import { noop } from "lodash-es";
import { Item } from "../actions/styled";
import { ArrowDown, SystemThumbUp } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function ThumbsDown({
  disabled = false,
  count = 0,
  noHover = false,
  highlight = false,
  thumbDownLoading = false,
  toggleThumbDown = noop,
  showThumbsDownList = false,
  setShowThumbsDownList = noop,
}) {
  return (
    <div className="flex items-center">
      <Item
        noHover={noHover}
        highlight={highlight}
        onClick={() => toggleThumbDown()}
      >
        {thumbDownLoading ? (
          <Loading size={14} />
        ) : (
          <SystemThumbUp
            className={cn(
              "w-5 h-5 scale-y-[-1]",
              disabled && "[&_path]:fill-textDisabled",
            )}
          />
        )}
        <div>Down{count > 0 ? ` ${count}` : ""}</div>
      </Item>
      {count > 0 && (
        <ArrowDown
          role="button"
          onClick={() => setShowThumbsDownList(!showThumbsDownList)}
          className={cn(
            "w-5 h-5 ml-1",
            "[&_path]:!fill-none [&_path]:stroke-textTertiary",
            showThumbsDownList && "rotate-180",
          )}
        />
      )}
    </div>
  );
}
