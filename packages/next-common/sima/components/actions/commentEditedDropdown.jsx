import React, { useCallback, useRef, useState } from "react";
import { ArrowDown } from "@osn/icons/subsquare";
import { useClickAway } from "react-use";
import { cn } from "next-common/utils";
import Divider from "next-common/components/styled/layout/divider";
import Loading from "next-common/components/loading";
import nextApi from "next-common/services/nextApi";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { Item } from "next-common/components/actions/styled";
import { useComment } from "next-common/components/comment/context";
import { useCommentActions } from "next-common/sima/context/commentActions";

const CommentVersionViewPopup = dynamicPopup(() =>
  import("next-common/sima/components/commentVersionViewPopup"),
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

export default function CommentEditedDropdown() {
  const comment = useComment();
  const { supportSima } = useCommentActions();

  const [show, setShow] = useState(false);
  const [items, setItems] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selected, setSelected] = useState(null);
  const ref = useRef();

  useClickAway(ref, () => setShow(false));

  const isEditedSimaComment =
    supportSima &&
    comment?.dataSource === "sima" &&
    !!comment?.cid &&
    !!comment?.edited;

  const loadHistory = useCallback(async () => {
    if (items !== null) {
      return;
    }
    const { result, error } = await nextApi.fetch(
      `sima/comments/${comment.cid}/history`,
    );
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    setItems(result?.items || []);
  }, [comment.cid, items]);

  if (!isEditedSimaComment) {
    return null;
  }

  const editCount = items ? Math.max(0, items.length - 1) : 0;

  return (
    <>
      <span ref={ref} className="relative inline-flex">
        <Item
          role="button"
          className="cursor-pointer"
          onClick={() => {
            setShow(!show);
            if (!show) {
              loadHistory();
            }
          }}
        >
          <span>Edited</span>
          <ArrowDown
            className={cn("w-4 h-4 transition-transform", show && "rotate-180")}
          />
        </Item>
        {show && (
          <div className="absolute z-999 right-0 top-full mt-2 min-w-65 max-h-[50vh] overflow-y-auto bg-neutral100 border border-neutral300 rounded-lg shadow-100 p-2">
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
                  const label = `${
                    isCreated ? "Created" : "Edited"
                  } ${formatEditedAgo(item.timestamp)}${
                    isMostRecent ? " (most recent)" : ""
                  }`;
                  return (
                    <button
                      key={item.cid}
                      type="button"
                      className="block w-full text-left px-2 py-1.5 rounded-md text14Medium text-textPrimary hover:bg-neutral200"
                      onClick={() => {
                        setShow(false);
                        setSelected({
                          item,
                          version: items.length - index,
                          previousItem: items[index + 1],
                        });
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}
      </span>
      {selected && (
        <CommentVersionViewPopup
          item={selected.item}
          version={selected.version}
          previousItem={selected.previousItem}
          setShow={() => setSelected(null)}
        />
      )}
    </>
  );
}
