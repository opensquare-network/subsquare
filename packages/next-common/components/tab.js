import { cn } from "next-common/utils";

export default function Tab({
  small,
  tabs,
  selectedTabId,
  setSelectedTabId,
  className = "",
  btnClassName = "",
}) {
  if (!tabs || !tabs.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex justify-between",
        "bg-neutral200",
        "rounded-lg p-1 h-12",
        small && "h-9",
        "tabs-container",
        className,
      )}
    >
      {tabs?.map?.(({ tabId, tabTitle }) => (
        <button
          key={tabId}
          className={cn(
            "text14Medium outline-none",
            "flex justify-center items-center flex-1",
            "py-2.5 w-[172px]",
            small && "py-0.5 w-[156px]",
            "text-textTertiary",
            selectedTabId === tabId &&
              "!text-textPrimary bg-neutral100 shadow-100 rounded",
            "tab-item",
            btnClassName,
          )}
          onClick={() => setSelectedTabId(tabId)}
        >
          {tabTitle}
        </button>
      ))}
    </div>
  );
}
