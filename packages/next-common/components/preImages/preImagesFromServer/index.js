import { useMemo, useState } from "react";
import { useAsync } from "react-use";
import ListTitleBar from "next-common/components/listTitleBar";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SearchBox from "../../searchBox";
import MyDeposit from "../myDeposit";
import { queryPreimages } from "./gql";
import { isSameAddress } from "next-common/utils";
import DesktopList from "./desktop";
import { formatNumber } from "@polkadot/util";
import MobileList from "./mobile";
import { getPreimageTicket } from "./common";
import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";
import { useSelector } from "react-redux";
import { useContextPapi } from "next-common/context/papi";
import { useContextApi } from "next-common/context/api";
import { parsePreImageCall } from "next-common/components/proposal/preImage";
import { useChainSettings } from "next-common/context/chain";
import {
  decodeCallTreeWithInfo,
  getMetadata,
} from "next-common/utils/callDecoder/decoder.mjs";
import { Binary } from "polkadot-api";

const metadataCache = new WeakMap();

async function getPapiMetadata(client) {
  if (!client) {
    return null;
  }

  let metadataPromise = metadataCache.get(client);
  if (!metadataPromise) {
    metadataPromise = getMetadata(client).catch((error) => {
      metadataCache.delete(client);
      throw error;
    });

    metadataCache.set(client, metadataPromise);
  }

  return metadataPromise;
}

function addLengthWarning(item, proposal, callLength) {
  const storeLength = item.requested?.maybeLen || item.unrequested?.len;
  const proposalWarning =
    typeof storeLength === "number" && callLength !== storeLength
      ? `Decoded call length does not match on-chain stored preimage length (${formatNumber(
          callLength,
        )} bytes vs ${formatNumber(storeLength)} bytes)`
      : null;

  return {
    ...item,
    proposal: proposalWarning ? null : proposal,
    proposalWarning,
  };
}

function addDecodeError(item, proposalError) {
  return {
    ...item,
    proposalError,
  };
}

function addApiLoading(item) {
  return {
    ...item,
    isApiLoading: true,
  };
}

function addNoPreimageBytes(item) {
  return {
    ...item,
    proposal: null,
    proposalError: null,
    proposalLength: 0,
    proposalWarning: "No preimage bytes found",
  };
}

function decodeWithLegacyApi(item, api) {
  if (!item.hex) {
    return addNoPreimageBytes(item);
  }

  if (!api) {
    return addApiLoading(item);
  }

  if (!api.registry) {
    return addDecodeError(item, "Legacy decode is not available");
  }

  const proposal = parsePreImageCall(item.hex, api);
  if (!proposal) {
    return addDecodeError(
      item,
      "Unable to decode preimage bytes into a valid Call",
    );
  }

  return addLengthWarning(item, proposal, proposal.encodedLength);
}

function useServerPreimages() {
  const trigger = useSelector(preImagesTriggerSelector);
  const { enablePapi } = useChainSettings();
  const api = useContextApi();
  const { client } = useContextPapi();
  const { value: parsedPreimages, loading } = useAsync(async () => {
    const preimages = await queryPreimages();
    if (!preimages) {
      return null;
    }

    if (!enablePapi) {
      return preimages.map((item) => decodeWithLegacyApi(item, api));
    }

    if (!client) {
      return preimages.map((item) => addApiLoading(item));
    }

    const metadata = await getPapiMetadata(client);
    if (!metadata) {
      return preimages.map((item) =>
        addDecodeError(item, "Unable to load metadata for PAPI decode"),
      );
    }

    return preimages.map((item) => {
      if (!item.hex) {
        return addNoPreimageBytes(item);
      }

      try {
        const callBytes = Binary.fromHex(item.hex).asBytes();
        const { proposal, callData } = decodeCallTreeWithInfo(
          callBytes,
          metadata,
        );

        return addLengthWarning(item, proposal, callData.length);
      } catch {
        return addDecodeError(
          item,
          "Unable to decode preimage bytes into a valid Call",
        );
      }
    });
  }, [trigger, client, enablePapi, api]);

  return { value: parsedPreimages, loading };
}

export default function PreImagesList() {
  const { value: data, loading } = useServerPreimages();
  const [searchValue, setSearchValue] = useState("");
  const [isMyDepositOn, setIsMyDepositOn] = useState(false);
  const realAddress = useRealAddress();

  let filteredData = useMemo(
    () =>
      data?.filter((preimage) => {
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
            titleCount={filteredData?.length || 0}
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
        <DesktopList data={filteredData} loading={loading} />
      </div>
      <div className="hidden max-md:block">
        <MobileList data={filteredData} loading={loading} />
      </div>
    </div>
  );
}
