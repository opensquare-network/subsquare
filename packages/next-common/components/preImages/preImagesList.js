import ListTitleBar from "next-common/components/listTitleBar";
import DesktopList from "./desktop";
import MobileList from "./mobile";
import SearchBox from "./searchBox";
import { useMemo, useState } from "react";
import MyDeposit from "./myDeposit";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";

function parseStatus(status, method) {
  const statusName = Object.keys(status || {})[0];
  if (!statusName) return {};
  const { deposit = [], ticket = [] } = status[statusName];
  if (method === "statusFor") {
    return {
      statusName,
      deposit,
    };
  }
  return {
    statusName,
    ticket,
  };
}

export default function PreImagesList() {
  const { hashes: data, loading } = useCombinedPreimageHashes();
  const [searchValue, setSearchValue] = useState("");
  const [isMyDepositOn, setIsMyDepositOn] = useState(false);
  const realAddress = useRealAddress();

  let filteredData = useMemo(
    () =>
      (data || []).filter(({ data: [hash, status], method }) => {
        if (!hash.includes(searchValue.toLowerCase())) {
          return false;
        }

        const { deposit, ticket } = parseStatus(status, method);
        const [who] = ticket || deposit || [];
        if (isMyDepositOn && realAddress) {
          return isSameAddress(who, realAddress);
        } else {
          return true;
        }
      }),
    [data, searchValue, isMyDepositOn, realAddress],
  );

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
        <SearchBox
          value={searchValue}
          setValue={setSearchValue}
          isDebounce={true}
        />
      </div>
      <div className="max-md:hidden">
        <DesktopList data={filteredData} loading={loading} />
      </div>
      <div className="hidden max-md:block">
        <MobileList data={filteredData} loading={loading} />
      </div>
    </div>
  );
}
