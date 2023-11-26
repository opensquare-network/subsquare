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

  const titleExtra = (
    <div className="flex items-center gap-[24px]">
      {realAddress && (
        <MyDeposit isOn={isMyDepositOn} setIsOn={setIsMyDepositOn} />
      )}
      <SearchBox value={searchValue} setValue={setSearchValue} />
    </div>
  );

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
      <ListTitleBar
        title="List"
        titleCount={filteredData?.length}
        titleExtra={titleExtra}
      />
      {width > 1024 ? (
        <DesktopList data={filteredData} />
      ) : (
        <MobileList data={filteredData} />
      )}
    </div>
  );
}
