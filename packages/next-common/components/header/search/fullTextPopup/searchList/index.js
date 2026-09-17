import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import DataList from "next-common/components/dataList";
import { getCategoryOrSearchItemPath } from "next-common/components/header/search/common/commonList";
import SearchItem from "./searchItem";

function FullTextSearchList({ data, isLoading, onClose, isMobile }) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isHoverDisabled, setIsHoverDisabled] = useState(false);
  const listContainerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIsHoverDisabled(true);
        setSelectedIndex((prev) => (prev + 1) % data?.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIsHoverDisabled(true);
        setSelectedIndex((prev) => (prev - 1 + data?.length) % data?.length);
      } else if (e.key === "Enter" && selectedIndex !== -1) {
        const path = getFullTextItemPath(data[selectedIndex]);
        if (path && path !== "/") {
          onClose?.();
          router.push(path);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const handleMouseMove = () => {
      if (isHoverDisabled) {
        setIsHoverDisabled(false);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [data, selectedIndex, router, onClose, isHoverDisabled]);

  useEffect(() => {
    if (selectedIndex >= 0 && listContainerRef.current) {
      const selectedItem = listContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`,
      );
      selectedItem?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [data]);

  return (
    <div className="pt-2">
      <DataList
        ref={listContainerRef}
        columns={[]}
        rows={data}
        loading={isLoading}
        renderItem={(DataListItem, idx, rows) => (
          <div
            key={idx}
            data-index={idx}
            className={`${
              selectedIndex === idx
                ? "bg-neutral200 rounded-[6px] shadow-sm"
                : ""
            }`}
            onMouseEnter={() => {
              if (!isHoverDisabled) {
                setSelectedIndex(idx);
              }
            }}
            onFocus={() => setSelectedIndex(idx)}
          >
            <SearchItem row={rows[idx]} onClose={onClose} />
          </div>
        )}
        className={`max-h-[550px] overflow-auto ${
          isMobile ? "h-[calc(80vh-90px)]" : ""
        }`}
        contentClassName="border-0 divide-y-0 px-2"
        titleClassName="border-0 pb-0"
      />
    </div>
  );
}

function getFullTextItemPath(row) {
  if (row.path !== undefined) {
    return row.path;
  }

  return getCategoryOrSearchItemPath(row);
}

export default React.memo(FullTextSearchList);
