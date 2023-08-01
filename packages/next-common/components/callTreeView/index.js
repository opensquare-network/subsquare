import { balanceTypes } from "next-common/components/democracy/metadata/normalize";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { hexToString } from "@polkadot/util";
import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import clsx from "clsx";
import isNil from "lodash.isnil";
import dynamic from "next/dynamic";
import FoldButton from "./foldButton";
import { useState } from "react";
import { getTypeDef } from "@polkadot/types/create";
import Copyable from "../copyable";

const LongText = dynamic(() => import("next-common/components/longText"), {
  ssr: false,
});

const accountTypes = ["MultiAddress", "AccountId32"];
const hashTypes = ["H256", "[u8;32]"];

function IndentPanel({ className, children }) {
  return (
    <div
      className={clsx(
        "flex flex-col pl-[16px] mt-[8px] border-l border-dashed border-neutral500 text-[12px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CallPanel({ call, callIndex }) {
  const [folded, setFolded] = useState(true);
  const { section, method, meta, argsEntries } = call || {};
  const { args } = meta || {};

  return (
    <div>
      <div className="flex px-[16px] py-[8px] bg-neutral200 rounded-[4px] justify-between">
        <div className="flex flex-col">
          <span className="font-medium leading-[20px] text-textTertiary">
            {isNil(callIndex) ? "call: Call" : `${callIndex}: Call: Call`}
          </span>
          <span className="font-medium leading-[20px] truncate">{`${section}.${method}`}</span>
        </div>
        <div className="flex flex-col justify-end">
          <FoldButton setFolded={setFolded} folded={folded} />
        </div>
      </div>
      {!folded && (
        <IndentPanel>
          <CallArgsPanel argsEntries={argsEntries} args={args} />
        </IndentPanel>
      )}
    </div>
  );
}

function CallArgsPanel({ argsEntries, args }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {(argsEntries || []).map(([argName, argValue], i) => (
        <ValuePanel
          key={argName}
          name={argName}
          value={argValue}
          type={args?.[i].type.toJSON()}
          typeName={args?.[i].typeName.toJSON()}
          registry={args?.[i].registry}
        />
      ))}
    </div>
  );
}

function ArrayPanel({ registry, name, type, values, sub }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <span className="font-medium truncate">
          {name ? `${name}: ${type}` : type}
        </span>
      </div>
      <IndentPanel className="gap-[8px]">
        {values.map((value, i) => (
          <ValuePanel
            key={`value-${i}`}
            name={`${i}`}
            type={(sub[i] || sub[0])?.type}
            typeName={(sub[i] || sub[0])?.type}
            value={value}
            registry={registry}
          />
        ))}
      </IndentPanel>
    </div>
  );
}

function CallsPanel({ name, type, calls }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium truncate">{`${name}: ${type}`}</span>
      <IndentPanel className="gap-[8px]">
        {calls.map((call, i) => (
          <CallPanel key={`call-${i}`} callIndex={i} call={call} />
        ))}
      </IndentPanel>
    </div>
  );
}

function TuplePanel({ registry, name, type, values, sub }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium truncate">
        {name ? `${name}: ${type}` : type}
      </span>
      <IndentPanel className="gap-[8px]">
        {(sub || []).map((item) => (
          <ValuePanel
            key={item.name}
            name={item.name}
            value={values[item.name]}
            type={item.type}
            typeName={item.type}
            registry={registry}
          />
        ))}
      </IndentPanel>
    </div>
  );
}

function OptionPanel({ registry, name, type, value, sub }) {
  const { name: subName, type: subType } = sub;
  return (
    <div className="flex flex-col">
      <span className="font-medium truncate">
        {name ? `${name}: ${type}` : type}
      </span>
      <IndentPanel className="gap-[8px]">
        <ValuePanel
          name={subName}
          value={value.value}
          type={subType}
          typeName={subType}
          registry={registry}
        />
      </IndentPanel>
    </div>
  );
}

function StructPanel({ registry, name, type, typeName, value, sub }) {
  let subName, subType;

  if (value.type) {
    ({ name: subName, type: subType } = sub.find(
      (item) => item.name === value.type.toString(),
    ));
  } else {
    return (
      <ValuePanel name={name} type={type} typeName={typeName} value={value} />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col px-[16px] py-[8px] bg-neutral200 rounded-[4px]">
        <span className="text-textTertiary">
          {name ? `${name}: ${type}` : type}
        </span>
        <div>{subName}</div>
      </div>
      {!value.isNone && (
        <IndentPanel className="gap-[8px]">
          <ValuePanel
            registry={registry}
            name={subName}
            typeName={subType}
            type={subType}
            value={value.value}
          />
        </IndentPanel>
      )}
    </div>
  );
}

function ValuePanel({ registry, name, type, typeName, value }) {
  const { symbol, decimals } = useChainSettings();

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
    valueComponent = <User add={val.id || val} fontSize={12} />;
  } else if (balanceTypes.includes(typeName)) {
    valueComponent = (
      <ValueDisplay value={toPrecision(val, decimals)} symbol={symbol} />
    );
  } else if (type === "Bytes") {
    const hex = val.toString();
    valueComponent = hexIsValidUTF8(hex) ? (
      <span className="break-all whitespace-pre-wrap">{hexToString(hex)}</span>
    ) : (
      <div className="!break-all">
        <LongText text={hex} />
      </div>
    );
  } else if (hashTypes.includes(type)) {
    valueComponent = <Copyable size={14}>{val}</Copyable>;
  } else {
    if (val instanceof Object && registry) {
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

    valueComponent = (
      <span className="break-all">
        {value.isNone
          ? "None"
          : val instanceof Object
          ? JSON.stringify(val)
          : val?.toString()}
      </span>
    );
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

export default function CallTreeView({ proposal }) {
  const { section, method, meta, argsEntries } = proposal || {};
  const { docs, args } = meta || {};
  const doc = docs[0]?.toJSON();

  return (
    <div className="text-textPrimary">
      <div className="flex flex-col">
        <span className="font-medium leading-[20px]">{`${section}.${method}`}</span>
        <span className="text-textTertiary text-[12px] leading-[16px]">
          {doc}
        </span>
      </div>
      <IndentPanel>
        <CallArgsPanel argsEntries={argsEntries} args={args} />
      </IndentPanel>
    </div>
  );
}
