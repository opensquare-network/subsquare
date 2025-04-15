import Popup from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";
import React, { useState } from "react";
import ReminderInput from "next-common/components/header/search/popup/reminderInput";
import InputInSearchPopup from "next-common/components/header/search/popup/input";
import LoadingSkeleton from "next-common/components/header/search/popup/loadingSkeleton";
import ReferendaList from "next-common/components/header/search/popup/referenda/index";
import useRefCallback from "next-common/hooks/useRefCallback";
import { isNil } from "lodash-es";
import NoResult from "next-common/components/header/search/popup/noResult";

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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = useRefCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData([
        {
          index: 234,
          title: "I am the title, you can look at me!",
          content: "hello world, i am the content",
        },
        {
          index: 235,
          title: "I am the title, you can look at me! 235",
          content: "hello world, i am the content 235",
        },
      ]);
    } finally {
      setLoading(false);
    }
  });

  const handleSearch = useRefCallback(() => {
    if (!searchValue) return;
    setData(null);
    fetchData();
  });

  return (
    <Popup className="p-0" onClose={onClose}>
      <div className="w-full min-w-full h-[640px] flex flex-col">
        <Wrapper className="border-b border-neutral300 h-[56px] py-2">
          <InputInSearchPopup
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onClose={() => {
              onClose();
              setData(null);
            }}
            handleSearch={handleSearch}
          />
        </Wrapper>
        {isNil(data) && !loading && (
          <Wrapper>
            <ReminderInput />
          </Wrapper>
        )}
        {loading && (
          <Wrapper>
            <LoadingSkeleton />
          </Wrapper>
        )}
        {data?.length > 0 && <ReferendaList data={data} />}
        {data?.length === 0 && <NoResult />}
      </div>
    </Popup>
  );
}

export default React.memo(SearchPopup);
