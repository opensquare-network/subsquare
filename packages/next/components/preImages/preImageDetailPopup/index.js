import { balanceTypes } from "next-common/components/democracy/metadata/normalize";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { hexToString } from "@polkadot/util";
import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import clsx from "clsx";
import isNil from "lodash.isnil";
import dynamic from "next/dynamic";

const LongText = dynamic(() => import("next-common/components/longText"), {
  ssr: false,
});

const accountTypes = ["MultiAddress", "AccountId32"];

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
  const { section, method, meta, argsEntries } = call || {};
  const { args } = meta || {};

  return (
    <IndentPanel>
      <div className="flex flex-col px-[16px] py-[8px] bg-neutral200 rounded-[4px]">
        <span className="font-medium leading-[20px] text-textTertiary">
          {isNil(callIndex) ? "call: Call" : `${callIndex}: Call: Call`}
        </span>
        <span className="font-medium leading-[20px]">{`${section}.${method}`}</span>
      </div>
      <CallArgsPanel argsEntries={argsEntries} args={args} />
    </IndentPanel>
  );
}

function CallArgsPanel({ argsEntries, args }) {
  return (
    <IndentPanel className="gap-[8px]">
      {(argsEntries || []).map(([argName, argValue], i) => (
        <ValuePanel
          key={argName}
          name={argName}
          value={argValue}
          type={args?.[i].type.toJSON()}
          typeName={args?.[i].typeName.toJSON()}
        />
      ))}
    </IndentPanel>
  );
}

function CallsPanel({ name, type, calls }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{`${name}: ${type}`}</span>
      {calls.map((call, i) => (
        <CallPanel key={`call-${i}`} callIndex={i} call={call} />
      ))}
    </div>
  );
}

function ValuePanel({ name, type, typeName, value }) {
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
    valueComponent = (
      <span className="break-all">
        {hexIsValidUTF8(hex) ? hexToString(hex) : <LongText text={hex} />}
      </span>
    );
  } else {
    valueComponent = <span className="break-all">{val.toString()}</span>;
  }

  return (
    <div className="flex flex-col px-[16px] py-[8px] bg-neutral200 rounded-[4px]">
      <span className="text-textTertiary">
        {name}: {type}
      </span>
      <div>{valueComponent}</div>
    </div>
  );
}

export default function PreimageDetailPopup({ proposal, setShow }) {
  console.log(proposal);
  const { section, method, meta, argsEntries } = proposal || {};
  const { docs, args } = meta || {};
  const doc = docs[0]?.toJSON();

  return (
    <BaseVotesPopup title="Arguments" onClose={() => setShow(false)}>
      <div className="text-textPrimary">
        <div className="flex flex-col">
          <span className="font-medium leading-[20px]">{`${section}.${method}`}</span>
          <span className="text-textTertiary text-[12px] leading-[16px]">
            {doc}
          </span>
        </div>
        <CallArgsPanel argsEntries={argsEntries} args={args} />
      </div>
    </BaseVotesPopup>
  );
}
