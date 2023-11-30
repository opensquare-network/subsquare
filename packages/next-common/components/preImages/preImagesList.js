import ListTitleBar from "next-common/components/listTitleBar";
import DesktopList from "./desktop";
import MobileList from "./mobile";
import SearchBox from "./searchBox";
import { useState } from "react";
import MyDeposit from "./myDeposit";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useWindowSize } from "usehooks-ts";
import isNil from "lodash.isnil";

function parseStatus(status) {
  const statusName = Object.keys(status || {})[0];
  if (!statusName) return {};
  const { deposit = [] } = status[statusName];
  return {
    statusName,
    deposit,
  };
}

export default function PreImagesList({ data }) {
  const [searchValue, setSearchValue] = useState("");
  const [isMyDepositOn, setIsMyDepositOn] = useState(false);
  const realAddress = useRealAddress();

  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  let filteredData = (data || []).filter(([hash, status]) => {
    if (!hash.includes(searchValue.toLowerCase())) {
      return false;
    }

    const { deposit } = parseStatus(status);
    const [who] = deposit || [];
    return !isMyDepositOn || who === realAddress;
  });

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex max-md:flex-col items-center gap-[24px] max-md:px-[24px] max-md:gap-[8px] mr-6 max-md:mr-0">
        <div className="flex grow justify-between max-md:w-full">
          <ListTitleBar
            className={"max-md:-ml-6"}
            title="List"
            titleCount={filteredData?.length}
          />
          {realAddress && (
            <MyDeposit isOn={isMyDepositOn} setIsOn={setIsMyDepositOn} />
          )}
        </div>
        <SearchBox value={searchValue} setValue={setSearchValue} />
      </div>

      {width > 1024 ? (
        <DesktopList data={filteredData} />
      ) : (
        <MobileList data={filteredData} />
      )}
    </div>
  );
}
