import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import DataList from "next-common/components/dataList";

export const SearchType = {
  REFERENDA: "referenda",
  //others
};

function CommonList({ data, isLoading, title, ItemBox, searchType, onClose }) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listContainerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % data?.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + data?.length) % data?.length);
      } else if (e.key === "Enter" && selectedIndex !== -1) {
        if (searchType === SearchType.REFERENDA) {
          const item = data[selectedIndex];
          onClose?.();
          router.push(`/${searchType}/${item.index}`);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data, selectedIndex, router, searchType, onClose]);

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
    setSelectedIndex(-1); // Reset selection when data changes
  }, [data]);

  return (
    <div className="pt-2">
      <p className="h-9 px-4 flex items-center text12Medium text-textTertiary">
        {title}
      </p>
      <DataList
        ref={listContainerRef}
        columns={[]}
        rows={data}
        loading={isLoading}
        renderItem={(DataListItem, idx, rows) => (
          <div
            key={idx}
            data-index={idx}
            className={selectedIndex === idx ? "bg-neutral200" : ""}
            onMouseEnter={() => setSelectedIndex(idx)}
            onFocus={() => setSelectedIndex(idx)}
          >
            <ItemBox row={rows[idx]} />
          </div>
        )}
        className="max-h-[525px] overflow-auto"
        contentClassName="border-0 divide-y-0 px-2"
        titleClassName="border-0 pb-0"
      />
    </div>
  );
}

export default React.memo(CommonList);
