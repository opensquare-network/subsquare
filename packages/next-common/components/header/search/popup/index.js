import Popup, { PopupSize } from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";
import React, { useState, useEffect } from "react";
import ReminderInput from "next-common/components/header/search/popup/reminderInput";
import InputInSearchPopup from "next-common/components/header/search/popup/input";
import LoadingSkeleton from "next-common/components/header/search/popup/loadingSkeleton";
import ReferendaList from "next-common/components/header/search/popup/referenda/index";
import useRefCallback from "next-common/hooks/useRefCallback";
import { isNil } from "lodash-es";
import NoResult from "next-common/components/header/search/popup/noResult";
import useReferendaSearchResults from "next-common/components/header/hooks/useReferendaSearchResults";

function Wrapper({ children, className = "" }) {
  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { className: "w-full" }),
      )}
    </div>
  );
}

function SearchPopup({ onClose, isMobile }) {
  const [searchValue, setSearchValue] = useState("");
  const { referenda, fetch, isLoading, clearResults } =
    useReferendaSearchResults();

  const handleSearch = useRefCallback(() => {
    if (!searchValue) return;
    fetch(searchValue);
  });

  const searchTimerRef = React.useRef(null);

  const debouncedSearch = useRefCallback((value) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      if (value.length > 2) {
        handleSearch();
      }
    }, 350);
  });

  useEffect(() => {
    if (searchValue.length === 0) {
      clearResults();
      return;
    }
    if (searchValue.length > 2) {
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
        {isNil(referenda) && !isLoading && searchValue.length === 0 && (
          <Wrapper>
            <ReminderInput isMobile={isMobile} />
          </Wrapper>
        )}
        {isLoading && (
          <Wrapper>
            <LoadingSkeleton />
          </Wrapper>
        )}
        {Array.isArray(referenda) && referenda.length > 0 && !isLoading && (
          <ReferendaList
            data={referenda}
            onClose={onClose}
            isMobile={isMobile}
          />
        )}
        {Array.isArray(referenda) &&
          referenda.length === 0 &&
          !isLoading &&
          searchValue.length > 2 && <NoResult isMobile={isMobile} />}
      </div>
    </Popup>
  );
}

export default React.memo(SearchPopup);
