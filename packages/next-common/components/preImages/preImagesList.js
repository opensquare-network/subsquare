import { sortBy } from "lodash-es";
import ListTitleBar from "next-common/components/listTitleBar";
import DesktopList from "./desktop";
import MobileList from "./mobile";
import SearchBox from "../searchBox";
import { useMemo, useState } from "react";
import MyDeposit from "./myDeposit";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useCombinedPreimageHashesLegacy } from "next-common/hooks/usePreimageHashes";
import { useCombinedPreimageHashesPapi } from "next-common/hooks/usePreimageHashesPapi";
import { useChainSettings } from "next-common/context/chain";
import { useListPagination } from "next-common/components/pagination/usePaginationComponent";

const PAGE_SIZE = 50;

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

function filterPreimages(data, searchValue, isMyDepositOn, realAddress) {
  return sortBy(data || [], (item) => item.data[0]).filter(
    ({ data: [hash, status], method }) => {
      if (!hash.includes(searchValue.toLowerCase())) {
        return false;
      }

      const { deposit, ticket } = parseStatus(status, method);
      const [who] = ticket || deposit || [];
      if (isMyDepositOn && realAddress) {
        return isSameAddress(who, realAddress);
      }

      return true;
    },
  );
}

function PreImagesListContent({ data, loading }) {
  const [searchValue, setSearchValue] = useState("");
  const [isMyDepositOn, setIsMyDepositOn] = useState(false);
  const realAddress = useRealAddress();

  const filteredData = useMemo(
    () => filterPreimages(data, searchValue, isMyDepositOn, realAddress),
    [data, searchValue, isMyDepositOn, realAddress],
  );

  const { pagedItems, component: pagination } = useListPagination(
    filteredData,
    PAGE_SIZE,
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
          placeholder="Search hash"
        />
      </div>
      <div className="max-md:hidden">
        <DesktopList data={pagedItems} loading={loading} />
      </div>
      <div className="hidden max-md:block">
        <MobileList data={pagedItems} loading={loading} />
      </div>
      {pagination}
    </div>
  );
}

export function LegacyPreImagesList() {
  const { hashes: data, loading } = useCombinedPreimageHashesLegacy();
  return <PreImagesListContent data={data} loading={loading} />;
}

export function PapiPreImagesList() {
  const { hashes: data, loading } = useCombinedPreimageHashesPapi();
  return <PreImagesListContent data={data} loading={loading} />;
}

export default function PreImagesList() {
  const { enablePapi } = useChainSettings();

  return enablePapi ? <PapiPreImagesList /> : <LegacyPreImagesList />;
}
