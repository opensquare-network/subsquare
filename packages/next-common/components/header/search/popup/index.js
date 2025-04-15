import Popup from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";
import React, { useState } from "react";
import ReminderInput from "next-common/components/header/search/popup/reminderInput";
import InputInSearchPopup from "next-common/components/header/search/popup/input";
import LoadingSkeleton from "next-common/components/header/search/popup/loadingSkeleton";

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
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  return (
    <Popup className="p-0" onClose={onClose}>
      <div className="w-full min-w-full h-[640px] flex flex-col">
        <Wrapper className="border-b border-neutral300 h-[56px] py-2">
          <InputInSearchPopup
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onClose={onClose}
          />
        </Wrapper>
        {!searchValue && !loading && (
          <Wrapper>
            <ReminderInput />
          </Wrapper>
        )}
        {loading && (
          <Wrapper>
            <LoadingSkeleton />
          </Wrapper>
        )}
      </div>
    </Popup>
  );
}

export default React.memo(SearchPopup);
