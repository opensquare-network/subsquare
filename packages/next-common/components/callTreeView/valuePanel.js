import dynamic from "next/dynamic";
import { balanceTypes } from "next-common/components/democracy/metadata/normalize";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { hexToString } from "@polkadot/util";
import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import { getTypeDef } from "@polkadot/types/create";
import Copyable from "../copyable";
import CallsPanel from "./callsPanel";
import CallPanel from "./callPanel";
import ArrayPanel from "./arrayPanel";
import TuplePanel from "./tuplePanel";
import OptionPanel from "./optionPanel";
import StructPanel from "./structPanel";
import AddressUser from "../user/addressUser";
import { useCallContext } from "./callContext";

const LongText = dynamic(() => import("next-common/components/longText"), {
  ssr: false,
});

const accountTypes = ["MultiAddress", "AccountId32"];
const hashTypes = ["H256", "[u8;32]"];

function TypedComponent({ registry, type, typeName, value }) {
  let sub;
  try {
    const t = getTypeDef(registry.createType(type).toRawType());
    ({ sub } = t);
    if (!sub) {
      return null;
    }
  } catch (e) {
    return null;
  }

  if (Array.isArray(value)) {
    return (
      <ArrayPanel
        registry={registry}
        name={name}
        type={type}
        values={value}
        sub={Array.isArray(sub) ? sub : [sub]}
      />
    );
  }

  if (value.size > 0) {
    return (
      <TuplePanel
        registry={registry}
        name={name}
        type={type}
        values={value}
        sub={Array.isArray(sub) ? sub : [sub]}
      />
    );
  }

  if (!Array.isArray(sub)) {
    return (
      <OptionPanel
        registry={registry}
        name={name}
        type={type}
        value={value}
        sub={sub}
      />
    );
  }

  return (
    <StructPanel
      registry={registry}
      name={name}
      type={type}
      typeName={typeName}
      value={value}
      sub={Array.isArray(sub) ? sub : [sub]}
    />
  );
}

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
const BalanceDisplay = [
  ...[
    "auctions",
    "balances",
    "bounties",
    "childBounties",
    "convictionVoting",
    "crowdloan",
    "slots",
    "staking",
    "treasury",
  ].map((section) => ({
    section,
  })),

  // Add more filters below ...
];

export function ValuePanel({ registry, name, type, typeName, value }) {
  const chain = useChain();
  const { symbol, decimals } = useChainSettings();
  const { section, method } = useCallContext();

  if (type === "Vec<Call>") {
    return (
      <CallsPanel name={name} type={type} typeName={typeName} calls={value} />
    );
  }

  if (type === "Call") {
    return <CallPanel call={value} />;
  }

  let valueComponent = null;
  const val = value.toJSON();

  if (accountTypes.includes(type)) {
    valueComponent = <AddressUser add={val.id || val} fontSize={12} />;
  } else if (
    balanceTypes.includes(typeName) &&
    BalanceDisplay.some(
      (item) =>
        (item.chain || item.section || item.method) &&
        (!item.chain || item.chain === chain) &&
        (!item.section || item.section === section) &&
        (!item.method || item.method === method),
    )
  ) {
    valueComponent = (
      <ValueDisplay value={toPrecision(val, decimals)} symbol={symbol} />
    );
  } else if (type === "Bytes") {
    const hex = val.toString();
    valueComponent = <HexValue hex={hex} />;
  } else if (hashTypes.includes(type)) {
    valueComponent = <Copyable size={14}>{val}</Copyable>;
  } else {
    if (val instanceof Object && registry) {
      return (
        <TypedComponent
          registry={registry}
          type={type}
          typeName={typeName}
          value={value}
        />
      );
    }

    valueComponent = value.isNone ? "None" : <TextValue val={val} />;
  }

  return (
    <div className="flex flex-col px-[16px] py-[8px] bg-neutral200 rounded-[4px]">
      <span className="text-textTertiary">
        {name ? `${name}: ${type}` : type}
      </span>
      <div>{valueComponent}</div>
    </div>
  );
}
