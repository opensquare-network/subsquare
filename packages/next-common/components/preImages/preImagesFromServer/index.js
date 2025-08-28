import { useMemo, useState } from "react";
import { useAsync } from "react-use";
import ListTitleBar from "next-common/components/listTitleBar";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SearchBox from "../searchBox";
import MyDeposit from "../myDeposit";
import { queryPreimages } from "./gql";
import { isSameAddress } from "next-common/utils";
import DesktopList from "./desktop";
import { useContextApi } from "next-common/context/api";
import { parsePreImageCall } from "next-common/components/proposal/preImage";
import { formatNumber } from "@polkadot/util";
import MobileList from "./mobile";
import { getPreimageTicket } from "./common";

function useServerPreimages() {
  const api = useContextApi();
  const { value: preimages, loading } = useAsync(queryPreimages, []);

  const parsedPreimages = useMemo(() => {
    if (!preimages) {
      return null;
    }
    return preimages.map((item) => {
      if (!api || !api.registry) {
        return item;
      }
      if (!item.hex) {
        return { ...item, proposalWarning: "No preimage bytes found" };
      }
      const proposal = parsePreImageCall(item.hex, api);
      if (proposal) {
        const callLength = proposal.encodedLength;
        const storeLength = item.requested?.maybeLen || item.unrequested?.len;
        if (callLength !== storeLength) {
          return {
            ...item,
            proposalWarning: `Decoded call length does not match on-chain stored preimage length (${formatNumber(
              callLength,
            )} bytes vs ${formatNumber(storeLength)} bytes)`,
          };
        }
        return { ...item, proposal };
      }
      return {
        ...item,
        proposalError: "Unable to decode preimage bytes into a valid Call",
      };
    });
  }, [preimages, api]);

  return { value: parsedPreimages, loading };
}

export default function PreImagesList() {
  const { value: data, loading } = useServerPreimages();
  const [searchValue, setSearchValue] = useState("");
  const [isMyDepositOn, setIsMyDepositOn] = useState(false);
  const realAddress = useRealAddress();

  let filteredData = useMemo(
    () =>
      (data || []).filter((preimage) => {
        if (!preimage.hash.includes(searchValue.toLowerCase())) {
          return false;
        }
        if (isMyDepositOn && realAddress) {
          const ticket = getPreimageTicket(preimage);
          return isSameAddress(ticket?.who, realAddress);
        }
        return true;
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
            titleCount={filteredData.length}
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
