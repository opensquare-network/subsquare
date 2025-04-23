import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import DataList from "next-common/components/dataList";

export const SearchType = {
  REFERENDA: "Referenda",
  DEMOCRACY_REFERENDA: "DemocracyReferenda",
  BOUNTIES: "Bounties",
  CHILD_BOUNTIES: "ChildBounties",
};

export const getPathAndCategoryByItemData = (item) => {
  const typeToPathAndCategoryMap = {
    [SearchType.REFERENDA]: {
      path:
        item.index !== -Infinity ? `/referenda/${item.index}` : "/referenda",
      category: "Referenda",
    },
    [SearchType.DEMOCRACY_REFERENDA]: {
      path:
        item.index !== -Infinity
          ? `/democracy/referenda/${item.index}`
          : "/democracy/referenda",
      category: "Democracy Referenda",
    },
    [SearchType.BOUNTIES]: {
      path:
        item.index !== -Infinity
          ? `/treasury/bounties/${item.index}`
          : "/treasury/bounties",
      category: "Bounties",
    },
    [SearchType.CHILD_BOUNTIES]: {
      path:
        item.index !== -Infinity
          ? `/treasury/child-bounties/${item.index}`
          : "/treasury/child-bounties",
      category: "Child Bounties",
    },
  };

  const { path, category } = typeToPathAndCategoryMap[item.type] || {};
  return { path, category };
};

function CommonList({ data, isLoading, ItemBox, onClose, isMobile }) {
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
        const item = data[selectedIndex];

        const { path } = getPathAndCategoryByItemData(item) || {};
        if (path) {
          onClose?.();
          router.push(path);
          return;
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
    setSelectedIndex(-1); // Reset selection when data changes
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
            <ItemBox row={rows[idx]} />
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

export default React.memo(CommonList);
