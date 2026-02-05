import dynamic from "next/dynamic";
import { balanceTypes } from "next-common/components/democracy/metadata/normalize";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { hexToString } from "@polkadot/util";
import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import Copyable from "../copyable";
import CallsPanel from "./callsPanel";
import CallPanel from "./callPanel";
import ArrayPanel from "./arrayPanel";
import TuplePanel from "./tuplePanel";
import OptionPanel from "./optionPanel";
import StructPanel from "./structPanel";
import AddressUser from "../user/addressUser";
import { useCallContext } from "./callContext";
import interlay from "next-common/utils/consts/settings/interlay";
import kintsugi from "next-common/utils/consts/settings/kintsugi";
import { isNil } from "lodash-es";
import EnumPanel from "./enumPanel";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";

const LongText = dynamic(() => import("next-common/components/longText"), {
  ssr: false,
});

// const accountTypes = ["MultiAddress", "AccountId32"];
const hashTypes = ["H256", "[u8;32]"];

function TextValue({ val }) {
  return (
    <span className="break-all">
      {val instanceof Object ? JSON.stringify(val) : val?.toString()}
    </span>
  );
}

function HexValue({ hex }) {
  if (hexIsValidUTF8(hex)) {
    return (
      <span className="break-all whitespace-pre-wrap">{hexToString(hex)}</span>
    );
  }
  return (
    <div className="!break-all">
      <LongText text={hex} />
    </div>
  );
}

// chain, section, method filters for displaying balances
const CanShowBalanceFilters = [
  ...[
    "auctions",
    "balances",
    "bounties",
    "childBounties",
    "convictionVoting",
    "crowdloan",
    "democracy",
    "slots",
    "staking",
    "treasury",
  ].map((section) => ({
    section,
  })),

  // Add more filters below ...
];

const ShouldNotShowBalanceFilters = [
  ...[kintsugi.name, interlay.name].map((chain) => ({
    chain,
    section: "democracy",
    method: "vote",
  })),

  // Add more filters below ...
];

function matchFilters(chain, section, method, filters) {
  return filters.some(
    (item) =>
      (item.chain || item.section || item.method) &&
      (!item.chain || item.chain === chain) &&
      (!item.section || item.section === section) &&
      (!item.method || item.method === method),
  );
}

function shouldShowBalance(chain, section, method) {
  const canShowBalance = matchFilters(
    chain,
    section,
    method,
    CanShowBalanceFilters,
  );
  const shouldNotShowBalance = matchFilters(
    chain,
    section,
    method,
    ShouldNotShowBalanceFilters,
  );

  return canShowBalance && !shouldNotShowBalance;
}

function ValueWrapper({ name, type, children }) {
  return (
    <div className="flex flex-col px-[16px] py-[8px] bg-neutral200 rounded-[4px]">
      <span className="text-textTertiary truncate">
        {name ? `${name}: ${type}` : type}
      </span>
      <div>{children}</div>
    </div>
  );
}

export function ValuePanel({ node }) {
  const chain = useChain();
  const { symbol, decimals } = useChainSettings();
  const { section, method } = useCallContext() || {};

  const { type, name, rawType, value } = node || {};

  // Handle Call type
  if (type === "Call") {
    return <CallPanel call={node} />;
  }

  // Handle Vec<Call> type
  if (type === "Vec<Call>") {
    return <CallsPanel node={node} />;
  }

  // Handle address values
  if (type === "H256" && isPolkadotAddress(value)) {
    return (
      <ValueWrapper name={name} type={type}>
        <AddressUser add={value} className="text12Medium text-textPrimary" />
      </ValueWrapper>
    );
  }

  // Handle hash types (H256, [u8;32]) before checking array rawType
  // These should be rendered as copyable strings, not as arrays
  if (hashTypes.includes(type)) {
    return (
      <ValueWrapper name={name} type={type}>
        <Copyable size={14}>{value}</Copyable>
      </ValueWrapper>
    );
  }

  // Handle different raw types
  if (rawType === "enum") {
    return <EnumPanel node={node} />;
  }

  if (rawType === "struct") {
    return <StructPanel node={node} />;
  }

  if (rawType === "sequence") {
    // Handle bytes/Bytes/Vec<u8> types before checking sequence rawType
    // These should be rendered as hex strings, not as arrays
    if (type === "bytes" || type === "Bytes" || type === "Vec<u8>") {
      const hex = value?.toString() || "";
      return (
        <ValueWrapper name={name} type={type}>
          <HexValue hex={hex} />
        </ValueWrapper>
      );
    }

    return <ArrayPanel node={node} />;
  }

  if (rawType === "array") {
    return <ArrayPanel node={node} />;
  }

  if (rawType === "tuple") {
    return <TuplePanel node={node} />;
  }

  if (rawType === "option") {
    return <OptionPanel node={node} />;
  }

  if (
    balanceTypes.includes(type) &&
    shouldShowBalance(chain, section, method)
  ) {
    return (
      <ValueWrapper name={name} type={type}>
        <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
      </ValueWrapper>
    );
  }

  return (
    <ValueWrapper name={name} type={type}>
      {isNil(value) ? "None" : <TextValue val={value} />}
    </ValueWrapper>
  );
}
