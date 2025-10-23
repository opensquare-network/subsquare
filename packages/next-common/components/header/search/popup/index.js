import Popup, { PopupSize } from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";
import React, { useState, useEffect, useCallback } from "react";
import ReminderInput from "next-common/components/header/search/popup/reminderInput";
import InputInSearchPopup from "next-common/components/header/search/popup/input";
import LoadingSkeleton from "next-common/components/header/search/popup/loadingSkeleton";
import SearchList from "next-common/components/header/search/popup/searchList";
import NoResult from "next-common/components/header/search/popup/noResult";
import useSearchResults from "next-common/components/header/hooks/useSearchResults";

function Wrapper({ children, className = "" }) {
  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { className: "w-full" }),
      )}
    </div>
  );
}

function SearchResultContent({
  searchValue,
  onClose,
  totalList,
  isLoading,
  isMobile,
}) {
  if (!searchValue) {
    return (
      <Wrapper>
        <ReminderInput isMobile={isMobile} />
      </Wrapper>
    );
  }

  if (searchValue.length < 3 && !/^\d+$/.test(searchValue)) {
    return null;
  }

  if (isLoading) {
    return (
      <Wrapper>
        <LoadingSkeleton />
      </Wrapper>
    );
  }

  if (!Array.isArray(totalList)) {
    return null;
  }

  if (totalList.length === 0) {
    return <NoResult isMobile={isMobile} />;
  }

  return <SearchList data={totalList} onClose={onClose} isMobile={isMobile} />;
}

function SearchPopup({ onClose, isMobile }) {
  const [searchValue, setSearchValue] = useState("");
  const { totalList, fetch, isLoading, clearResults } = useSearchResults();

  const handleSearch = useCallback(
    (searchValue) => {
      if (!searchValue) return;
      fetch(searchValue);
    },
    [fetch],
  );

  const searchTimerRef = React.useRef(null);

  const debouncedSearch = useCallback(
    (searchValue) => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        handleSearch(searchValue);
      }, 350);
    },
    [handleSearch],
  );

  useEffect(() => {
    if (searchValue.length === 0) {
      clearResults();
      return;
    }
    if (searchValue.length > 2 || /^\d+$/.test(searchValue)) {
      debouncedSearch(searchValue);
    }

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchValue, clearResults, debouncedSearch]);

  const mobilesStyles = "w-[calc(100vw-48px)] h-[80vh]";

  return (
    <Popup
      className="p-0"
      size={PopupSize.LARGE}
      onClose={onClose}
      mobileClassName={mobilesStyles}
      computerClassName="h-[640px]"
    >
      <div className="flex flex-col w-full">
        <Wrapper className="border-b border-neutral300 h-[56px] py-2">
          <InputInSearchPopup
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onClose={() => {
              onClose();
              clearResults();
            }}
          />
        </Wrapper>
        <SearchResultContent
          searchValue={searchValue}
          onClose={onClose}
          totalList={totalList}
          isLoading={isLoading}
          isMobile={isMobile}
        />
      </div>
    </Popup>
  );
}

export default React.memo(SearchPopup);
