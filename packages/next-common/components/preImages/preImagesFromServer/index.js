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
import { decodeCallTreeWithInfo } from "next-common/utils/callDecoder/decoder.mjs";
import { getCachedMetadata as getPapiMetadata } from "next-common/utils/papi/getCachedMetadata";
import { Binary } from "polkadot-api";
import { getTextPreimage } from "./textPreimage";
import useRelayChainMetadata from "next-common/hooks/preimages/useRelayChainMetadata";

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
  if (!api) {
    return addApiLoading(item);
  }

  if (!api.registry) {
    return addDecodeError(item, "Legacy decode is not available");
  }

  if (!item.hex) {
    return addNoPreimageBytes(item);
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

function decodeWithPapi(item, metadataList) {
  if (!item.hex) {
    return addNoPreimageBytes(item);
  }

  const callBytes = Binary.fromHex(item.hex);

  // A preimage can be a call of any of the chains involved in the asset hub
  // migration, and metadata only decodes the calls of its own chain.
  for (const metadata of metadataList) {
    try {
      const { proposal, callData } = decodeCallTreeWithInfo(
        callBytes,
        metadata,
      );

      return addLengthWarning(item, proposal, callData.length);
    } catch {
      // Try the next metadata.
    }
  }

  const textPreimage = getTextPreimage(callBytes);
  if (textPreimage !== null) {
    return {
      ...item,
      textPreimage,
    };
  }

  return addDecodeError(
    item,
    "Unable to decode preimage bytes into a valid Call",
  );
}

// Decoding every preimage of the list in one go keeps the main thread busy
// for as long as it takes, which is noticeable on a list of hundreds of
// preimages. Decoding in slices keeps the page responsive while it loads.
const DECODE_TIME_SLICE = 8;

function yieldToMainThread() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function decodeInSlices(preimages, decode) {
  const decoded = [];
  let sliceEnd = performance.now() + DECODE_TIME_SLICE;

  for (const preimage of preimages) {
    decoded.push(decode(preimage));

    if (performance.now() >= sliceEnd) {
      await yieldToMainThread();
      sliceEnd = performance.now() + DECODE_TIME_SLICE;
    }
  }

  return decoded;
}

function useServerPreimages() {
  const trigger = useSelector(preImagesTriggerSelector);
  const { enablePapi } = useChainSettings();
  const api = useContextApi();
  const { client } = useContextPapi();
  const relayChainMetadata = useRelayChainMetadata(enablePapi);

  // The legacy api is not used while papi is enabled, and leaving it out of
  // the dependencies avoids decoding every preimage again when it connects.
  const dependencies = enablePapi
    ? [trigger, enablePapi, client, relayChainMetadata]
    : [trigger, enablePapi, api];

  const { value: parsedPreimages, loading } = useAsync(async () => {
    const preimages = await queryPreimages();
    if (!preimages) {
      return null;
    }

    if (!enablePapi) {
      return decodeInSlices(preimages, (item) =>
        decodeWithLegacyApi(item, api),
      );
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

    const relayMetadata = relayChainMetadata ? await relayChainMetadata : null;
    const metadataList = relayMetadata ? [metadata, relayMetadata] : [metadata];

    return decodeInSlices(preimages, (item) =>
      decodeWithPapi(item, metadataList),
    );
  }, dependencies);

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
