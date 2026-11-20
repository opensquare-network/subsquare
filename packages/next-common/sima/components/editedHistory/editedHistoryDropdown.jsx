import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "@osn/icons/subsquare";
import { useClickAway } from "react-use";
import { cn } from "next-common/utils";
import Divider from "next-common/components/styled/layout/divider";
import Loading from "next-common/components/loading";
import nextApi from "next-common/services/nextApi";
import dynamicPopup from "next-common/lib/dynamic/popup";

const VersionViewPopup = dynamicPopup(() =>
  import("next-common/sima/components/editedHistory/versionViewPopup"),
);

function formatEditedAgo(timestamp) {
  const diff = Math.max(0, Date.now() - timestamp);
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);
  const minutes = Math.floor((diff % hour) / minute);

  const parts = [];
  if (days > 0) {
    parts.push(`${days} day${days > 1 ? "s" : ""}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (parts.length === 0) {
    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    } else {
      return "just now";
    }
  }
  return `${parts.join(" ")} ago`;
}

export function PlainEditedMarker({ label = "Edited", className }) {
  return (
    <div className={cn("text12Medium text-textTertiary", className)}>
      {label}
    </div>
  );
}

export default function EditedHistoryDropdown({
  historyUrl,
  popupTitle = "Edit History",
  showTitle = false,
  prefetch = false,
  label = "Edited",
  firstVersionLabel = "Created",
  firstVersionTimeLabel = "Created at",
  className,
}) {
  const [show, setShow] = useState(false);
  const [history, setHistory] = useState(null);
  const [selected, setSelected] = useState(null);
  const loadingUrlRef = useRef(null);
  const currentUrlRef = useRef(historyUrl);
  const ref = useRef();

  useClickAway(ref, () => setShow(false));

  const loadHistory = useCallback(async () => {
    if (!historyUrl || loadingUrlRef.current === historyUrl) {
      return;
    }

    loadingUrlRef.current = historyUrl;
    try {
      const { result, error } = await nextApi.fetch(historyUrl);
      if (currentUrlRef.current !== historyUrl) {
        return;
      }
      if (error) {
        setHistory({ url: historyUrl, error: error.message });
        return;
      }
      setHistory({ url: historyUrl, items: result?.items || [] });
    } finally {
      if (loadingUrlRef.current === historyUrl) {
        loadingUrlRef.current = null;
      }
    }
  }, [historyUrl]);

  const isHistoryFresh = !!history && history.url === historyUrl;
  const items = isHistoryFresh ? history.items : null;
  const errorMessage = isHistoryFresh ? history.error : null;

  useEffect(() => {
    currentUrlRef.current = historyUrl;
    setHistory(null);
    setSelected(null);
    setShow(false);
  }, [historyUrl]);

  useEffect(() => {
    if (!show || isHistoryFresh) {
      return;
    }
    loadHistory();
  }, [show, isHistoryFresh, loadHistory]);

  useEffect(() => {
    if (!prefetch || !historyUrl || isHistoryFresh) {
      return;
    }
    loadHistory();
  }, [prefetch, historyUrl, isHistoryFresh, loadHistory]);

  if (!historyUrl) {
    return <PlainEditedMarker label={label} className={className} />;
  }

  if (prefetch && (!items || items.length <= 1)) {
    return <PlainEditedMarker label={label} className={className} />;
  }

  const editCount = items ? Math.max(0, items.length - 1) : 0;

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center text12Medium text-textTertiary",
          className,
        )}
      >
        <span
          role="button"
          className={cn(
            "group cursor-pointer inline-flex items-center gap-1",
            "hover:text-textSecondary transition-colors",
          )}
          onClick={() => setShow(!show)}
        >
          <span>{label}</span>
          <ArrowDown
            className={cn(
              "w-4 h-4",
              "[&_path]:fill-none! [&_path]:stroke-textTertiary",
              "group-hover:[&_path]:stroke-textSecondary",
              show && "rotate-180",
            )}
          />
        </span>
        {show && (
          <div className="absolute z-999 left-0 top-full mt-1 min-w-65 max-h-[50vh] overflow-y-auto bg-neutral100 border border-neutral300 rounded-lg shadow-200 p-2">
            {items === null && !errorMessage && (
              <div className="flex justify-center py-6">
                <Loading size={20} />
              </div>
            )}
            {errorMessage && (
              <div className="py-4 text-center text14Medium text-textTertiary">
                {errorMessage}
              </div>
            )}
            {items && (
              <>
                <div className="px-2 py-1 text12Medium text-textTertiary">
                  Edited {editCount} {editCount > 1 ? "times" : "time"}
                </div>
                <Divider margin={8} />
                {items.map((item, index) => {
                  const isCreated = index === items.length - 1;
                  const isMostRecent = index === 0;
                  const itemLabel = `${
                    isCreated ? firstVersionLabel : "Edited"
                  } ${formatEditedAgo(item.timestamp)}${
                    isMostRecent ? " (most recent)" : ""
                  }`;
                  return (
                    <button
                      key={item.cid}
                      type="button"
                      className="block w-full text-left px-2 py-1.5 rounded-md text12Medium text-textPrimary hover:bg-neutral200"
                      onClick={() => {
                        setShow(false);
                        setSelected({
                          item,
                          version: items.length - index,
                          previousItem: items[index + 1],
                        });
                      }}
                    >
                      {itemLabel}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
      {selected && (
        <VersionViewPopup
          item={selected.item}
          version={selected.version}
          previousItem={selected.previousItem}
          popupTitle={popupTitle}
          showTitle={showTitle}
          firstVersionTimeLabel={firstVersionTimeLabel}
          setShow={() => setSelected(null)}
        />
      )}
    </>
  );
}
