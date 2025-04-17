import Popup from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";
import React, { useState, useEffect } from "react";
import ReminderInput from "next-common/components/header/search/popup/reminderInput";
import InputInSearchPopup from "next-common/components/header/search/popup/input";
import LoadingSkeleton from "next-common/components/header/search/popup/loadingSkeleton";
import ReferendaList from "next-common/components/header/search/popup/referenda/index";
import useRefCallback from "next-common/hooks/useRefCallback";
import { isNil, throttle } from "lodash-es";
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
  const { referenda, fetch, isLoading, setReferenda } =
    useReferendaSearchResults();

  const handleSearch = useRefCallback(() => {
    if (!searchValue) return;
    setReferenda(null);
    fetch(searchValue);
  });

  const throttleTimer = React.useRef();
  const throttleSearch = useRefCallback(
    throttle(
      (value) => {
        if (value.length > 2) {
          handleSearch();
        }
      },
      1000,
      { leading: true, trailing: false },
    ),
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (searchValue.length === 0) {
      setReferenda(null);
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
        throttleTimer.current = null;
      }
      abortController.abort();
      return;
    }

    throttleTimer.current = setTimeout(() => {
      throttleSearch(searchValue);
    }, 300);

    return () => {
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
      abortController.abort();
      setReferenda(null);
    };
  }, [searchValue, setReferenda, throttleSearch]);

  const mobilesStyles = "w-[calc(100vw-48px)] h-[75vh]";
  const desktopStyles = "w-[960px] h-[640px]";

  return (
    <Popup
      className={`p-0 ${isMobile ? mobilesStyles : desktopStyles}`}
      onClose={onClose}
    >
      <div className="flex flex-col w-full">
        <Wrapper className="border-b border-neutral300 h-[56px] py-2">
          <InputInSearchPopup
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onClose={() => {
              onClose();
              setReferenda(null);
            }}
          />
        </Wrapper>
        {isNil(referenda) && !isLoading && (
          <Wrapper>
            <ReminderInput isMobile={isMobile} />
          </Wrapper>
        )}
        {isLoading && (
          <Wrapper>
            <LoadingSkeleton />
          </Wrapper>
        )}
        {Array.isArray(referenda) && referenda.length > 0 && (
          <ReferendaList
            data={referenda}
            onClose={onClose}
            isMobile={isMobile}
          />
        )}
        {Array.isArray(referenda) && referenda.length === 0 && !isLoading && (
          <NoResult isMobile={isMobile} />
        )}
      </div>
    </Popup>
  );
}

export default React.memo(SearchPopup);
