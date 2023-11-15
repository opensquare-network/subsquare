import { getTypeDef } from "@polkadot/types";
import { TypeDefInfo } from "@polkadot/types/types";
import { isBn } from "@polkadot/util";

import AccountParam from "./accountParam";
import BalanceParam from "./balanceParam";
import TextParam from "./textParam";
import useApi from "next-common/utils/hooks/useApi";
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
  { c: TextParam, t: ["PalletAllianceCid"] },
  { c: TextParam, t: ["Code"] },
  { c: TextParam, t: ["Raw", "RuntimeSessionKeys", "Keys"] },
  { c: EnumParam, t: ["Enum"] },
  { c: Hash256Param, t: ["Hash", "H256"] },
  { c: Hash160Param, t: ["H160"] },
  { c: Hash512Param, t: ["H512"] },
  { c: TextParam, t: ["KeyValue"] },
  { c: TextParam, t: ["Vec<KeyValue>"] },
  { c: AmountParam, t: ["Moment", "MomentOf"] },
  { c: NullParam, t: ["Null"] },
  { c: TextParam, t: ["OpaqueCall"] },
  { c: OptionParam, t: ["Option"] },
  { c: TextParam, t: ["String", "Text"] },
  { c: StructParam, t: ["Struct"] },
  { c: StructParam, t: ["Tuple"] },
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

function findComponent({ registry, def }) {
  if (!registry || !def) {
    return NullParam;
  }

  if (["AccountId20", "AccountId32"].includes(def.type)) {
    const defType = `AccountId${registry.createType("AccountId").length}`;

    if (def.type !== defType) {
      if (def.type === "AccountId20") {
        return AccountId20Param;
      } else {
        return AccountId32Param;
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
      const instance = registry.createType(type);
      const raw = getTypeDef(instance.toRawType());

      Component = findOne(raw.lookupName || raw.type) || findOne(fromDef(raw));

      if (Component) {
        return Component;
      } else if (isBn(instance)) {
        return TextParam;
      }
    } catch (e) {
      console.error(`params: findComponent: ${e.message}`);
    }
  }

  return Component || TextParam;
}

export default function Param({ name, def, indent = false, value, setValue }) {
  const api = useApi();
  const registry = api?.registry;
  const Component = findComponent({ registry, def });

  if (Component === NullParam) {
    return null;
  }

  if (Component === VoteParam) {
    return <VoteParam def={def} value={value} setValue={setValue} />;
  }

  const content = (
    <>
      <span className="text12Bold whitespace-nowrap overflow-hidden">
        {name && `${name}:`} {def.type}
        {def.typeName && `(${def.typeName})`}
      </span>
      <Component def={def} value={value} setValue={setValue} />
    </>
  );

  if (!indent) {
    return <div className="flex flex-col gap-[8px]">{content}</div>;
  }

  return (
    <IndentPanel className="flex flex-col gap-[8px]">{content}</IndentPanel>
  );
}
