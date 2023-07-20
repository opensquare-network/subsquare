import clsx from "clsx";

export default function Tab({ small, tabs, selectedTabId, setSelectedTabId }) {
  return (
    <div
      className={clsx(
        "flex justify-between",
        "bg-neutral200",
        "rounded-lg p-1 h-12",
        small && "h-9",
        "tabs-container",
      )}
    >
      {tabs?.map?.(({ tabId, tabTitle }) => (
        <button
          key={tabId}
          className={clsx(
            "text14Medium outline-none",
            "flex justify-center items-center flex-1",
            "py-2.5 w-[172px]",
            small && "py-0.5 w-[156px]",
            "text-textTertiary",
            selectedTabId === tabId &&
              "!text-textPrimary bg-neutral100 shadow-100 rounded",
            "tab-item",
          )}
          onClick={() => setSelectedTabId(tabId)}
        >
          {tabTitle}
        </button>
      ))}
    </div>
  );
}
