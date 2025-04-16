import Popup from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";
import React, { useState } from "react";
import ReminderInput from "next-common/components/header/search/popup/reminderInput";
import InputInSearchPopup from "next-common/components/header/search/popup/input";
import LoadingSkeleton from "next-common/components/header/search/popup/loadingSkeleton";
import ReferendaList from "next-common/components/header/search/popup/referenda/index";
import useRefCallback from "next-common/hooks/useRefCallback";
import { isNil, debounce, throttle } from "lodash-es";
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

function SearchPopup({ onClose }) {
  const [searchValue, setSearchValue] = useState("");
  const { referenda, fetch, isLoading, setReferenda } =
    useReferendaSearchResults();

  const handleSearch = useRefCallback(() => {
    if (!searchValue) return;
    setReferenda(null);
    fetch(searchValue);
  });

  const debouncedSearch = useRefCallback(
    throttle((value) => {
      if (value.length > 2) {
        handleSearch();
      }
    }, 3000),
  );

  React.useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

  return (
    <Popup className="p-0" onClose={onClose}>
      <div className="w-full min-w-full h-[640px] flex flex-col">
        <Wrapper className="border-b border-neutral300 h-[56px] py-2">
          <InputInSearchPopup
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onClose={() => {
              onClose();
              setReferenda(null);
            }}
            handleSearch={handleSearch}
          />
        </Wrapper>
        {isNil(referenda) && !isLoading && (
          <Wrapper>
            <ReminderInput />
          </Wrapper>
        )}
        {isLoading && (
          <Wrapper>
            <LoadingSkeleton />
          </Wrapper>
        )}
        {referenda?.length > 0 && <ReferendaList data={referenda} />}
        {referenda?.length === 0 && !isLoading && <NoResult />}
      </div>
    </Popup>
  );
}

export default React.memo(SearchPopup);
