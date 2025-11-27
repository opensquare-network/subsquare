import { getTypeDef } from "@polkadot/types";
import { TypeDefInfo } from "@polkadot/types/types";
import { isBn } from "@polkadot/util";
import AccountParam from "./accountParam";
import BalanceParam from "./balanceParam";
import TextParam from "./textParam";
import EnumParam from "./enumParam";
import StructParam from "./structParam";
import NullParam from "./nullParam";
import VectorParam from "./vectorParam";
import Hash256Param from "./hash256Param";
import BytesParam from "./bytesParam";
import AmountParam from "./amountParam";
import IntegerParam from "./integerParam";
import Hash160Param from "./hash160Param";
import Hash512Param from "./hash512Param";
import CallParam from "./callParam";
import OptionParam from "./optionParam";
import VoteParam from "./voteParam";
import VoteThresholdParam from "./voteThresholdParam";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import AccountId20Param from "./accountId20Param";
import AccountId32Param from "./accountId32Param";
import VectorFixedParam from "./vectorFixedParam";
import BoolParam from "./boolParam";
import TupleParam from "./tupleParam";
import RawParam from "./rawParam";
import CidParam from "./cidParam";
import KeyValueParam from "./keyValueParam";
import { useContextApi } from "next-common/context/api";
import BTreeMapParam from "./btreeMapParam";

const SPECIAL_TYPES = [
  "AccountId",
  "AccountId20",
  "AccountId32",
  "AccountIndex",
  "Address",
  "Balance",
  "BalanceOf",
  "Vec<KeyValue>",
];

const componentDef = [
  {
    c: AccountParam,
    t: ["AccountId", "Address", "LookupSource", "MultiAddress"],
  },
  {
    c: IntegerParam,
    t: ["i8", "i16", "i32", "i64", "i128"],
  },
  {
    c: AmountParam,
    t: ["AccountIndex", "u8", "u16", "u32", "u64", "u128", "u256"],
  },
  { c: BalanceParam, t: ["Amount", "Balance", "BalanceOf"] },
  { c: BoolParam, t: ["bool"] },
  { c: BytesParam, t: ["Bytes", "Vec<u8>"] },
  { c: CallParam, t: ["Call", "Proposal", "RuntimeCall"] },
  { c: CidParam, t: ["PalletAllianceCid"] },
  { c: BytesParam, t: ["Code"] },
  { c: RawParam, t: ["Raw", "RuntimeSessionKeys", "Keys"] },
  { c: EnumParam, t: ["Enum"] },
  { c: Hash256Param, t: ["Hash", "H256"] },
  { c: Hash160Param, t: ["H160"] },
  { c: Hash512Param, t: ["H512"] },
  { c: KeyValueParam, t: ["KeyValue"] },
  { c: VectorParam, t: ["Vec<KeyValue>"] },
  { c: BTreeMapParam, t: ["BTreeMap"] },
  { c: AmountParam, t: ["Moment", "MomentOf"] },
  { c: NullParam, t: ["Null"] },
  { c: CallParam, t: ["OpaqueCall"] },
  { c: OptionParam, t: ["Option"] },
  { c: TextParam, t: ["String", "Text"] },
  { c: StructParam, t: ["Struct"] },
  { c: TupleParam, t: ["Tuple"] },
  { c: VectorParam, t: ["Vec", "BTreeSet"] },
  { c: VectorFixedParam, t: ["VecFixed"] },
  { c: VoteParam, t: ["Vote"] },
  { c: VoteThresholdParam, t: ["VoteThreshold"] },
  { c: TextParam, t: ["Unknown"] },
];

const components = componentDef.reduce((components, { c, t }) => {
  t.forEach((type) => {
    components[type] = c;
  });

  return components;
}, {});

function fromDef({ displayName, info, lookupName, sub, type }) {
  if (displayName && SPECIAL_TYPES.includes(displayName)) {
    return displayName;
  } else if (type.endsWith("RuntimeSessionKeys")) {
    return "RuntimeSessionKeys";
  }

  const typeValue = lookupName || type;

  switch (info) {
    case TypeDefInfo.Compact:
      return sub.type;

    case TypeDefInfo.Option:
      return "Option";

    case TypeDefInfo.Enum:
      return "Enum";

    case TypeDefInfo.Struct:
      return "Struct";

    case TypeDefInfo.BTreeSet:
      return "BTreeSet";

    case TypeDefInfo.BTreeMap:
      return "BTreeMap";

    case TypeDefInfo.Tuple:
      return components[type] === AccountParam ? type : "Tuple";

    case TypeDefInfo.Vec:
      return type === "Vec<u8>"
        ? "Bytes"
        : ["Vec<KeyValue>"].includes(type)
        ? "Vec<KeyValue>"
        : "Vec";

    case TypeDefInfo.VecFixed:
      return sub.type === "u8" ? type : "VecFixed";

    default:
      return typeValue;
  }
}

const rawTypeCache = {};

function getRawType(registry, type) {
  if (rawTypeCache[type]) {
    return rawTypeCache[type];
  }
  const instance = registry.createType(type);
  const raw = getTypeDef(instance.toRawType());
  rawTypeCache[type] = { instance, raw };
  return { instance, raw };
}

function findComponent({ registry, def }) {
  if (!registry || !def) {
    return { Component: NullParam, def };
  }

  if (["AccountId20", "AccountId32"].includes(def.type)) {
    const defType = `AccountId${registry.createType("AccountId").length}`;

    if (def.type !== defType) {
      if (def.type === "AccountId20") {
        return { Component: AccountId20Param, def };
      } else {
        return { Component: AccountId32Param, def };
      }
    }
  }

  const findOne = (type) => (type ? components[type] : null);

  const type = fromDef(def);
  let Component =
    findOne(def.lookupName) ||
    findOne(def.typeName) ||
    findOne(def.type) ||
    findOne(type);

  if (!Component) {
    try {
      const { instance, raw } = getRawType(registry, type);

      Component = findOne(raw.lookupName || raw.type) || findOne(fromDef(raw));

      if (Component) {
        return { Component, def: raw };
      } else if (isBn(instance)) {
        return { Component: TextParam, def: raw };
      }
    } catch (e) {
      console.error(`params: findComponent: ${e.message}`);
    }
  }

  return { Component: Component || TextParam, def };
}

export default function Param({ name, def, indent = false, value, setValue }) {
  const api = useContextApi();
  const registry = api?.registry;
  const { Component, def: _def } = findComponent({ registry, def });

  const newDef = _def || def;

  const title = (
    <span className="text12Bold text-textPrimary whitespace-nowrap overflow-hidden">
      {name && `${name}:`} {def?.type}
      {def?.typeName && ` (${def?.typeName})`}
    </span>
  );

  const content = (
    <Component title={title} def={newDef} value={value} setValue={setValue} />
  );

  if (!indent) {
    return <div className="flex flex-col gap-[8px]">{content}</div>;
  }

  return (
    <IndentPanel className="flex flex-col gap-[8px]">{content}</IndentPanel>
  );
}
