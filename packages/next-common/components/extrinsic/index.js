import { useEffect, useState } from "react";
import { getTypeDef } from "@polkadot/types/create";
import MethodSelect from "./methodSelect";
import Params from "./params";
import SectionSelect from "./sectionSelect";
import { useObjectItemState } from "next-common/hooks/useItemState";
import { useContextApi } from "next-common/context/api";

function getParams({ meta }) {
  return meta.args.map(({ name, type, typeName }) => ({
    name: name.toString(),
    type: {
      ...getTypeDef(type.toString()),
      ...(typeName.isSome ? { typeName: typeName.unwrap().toString() } : {}),
    },
  }));
}

function getCallState(fn, values = []) {
  return {
    extrinsic: {
      fn,
      params: getParams(fn),
    },
    values,
  };
}

export function getExtrinsicValues(value) {
  if (!value) {
    return value;
  }

  if (value.isValid === undefined) {
    return value.data;
  }

  if (value.isValid !== true) {
    return undefined;
  }

  if (!value.data) {
    return value.data;
  }

  if (value.data?.registry) {
    return value.data;
  }

  if (Array.isArray(value.data)) {
    return value.data.map((v) => getExtrinsicValues(v));
  }

  if (typeof value.data === "object") {
    const values = {};
    for (const key in value.data) {
      values[key] = getExtrinsicValues(value.data[key]);
    }
    return values;
  }

  return value.data;
}

export default function Extrinsic({
  defaultSectionName,
  defaultMethodName,
  // value,
  setValue,
  defalueCallState,
  onCallStateChange,
}) {
  const api = useContextApi();
  const [sectionName, setSectionName] = useState(defaultSectionName);
  const [methodName, setMethodName] = useState(defaultMethodName);
  const [callState, setCallState] = useState(defalueCallState);
  useEffect(() => {
    onCallStateChange?.(callState);
  }, [callState, onCallStateChange]);

  const [callValues, setCallValues] = useObjectItemState({
    items: callState,
    itemIndex: "values",
    setItems: setCallState,
  });

  useEffect(() => {
    if (!callState) return;

    const { extrinsic, values } = callState;
    const { fn } = extrinsic;

    try {
      const fnValues = getExtrinsicValues(values);
      const tx = fn(...(fnValues || []));
      setValue({
        isValid: true,
        data: tx,
      });
    } catch (e) {
      setValue({
        isValid: false,
        data: undefined,
      });
    }
  }, [callState, setValue]);

  useEffect(() => {
    if (!api) return;

    const fn = api.tx[sectionName]?.[methodName];
    if (!fn) return;

    setCallState((prev) => {
      if (
        prev?.extrinsic.fn.section === sectionName &&
        prev?.extrinsic.fn.method === methodName
      ) {
        return prev;
      }
      return getCallState(fn);
    });
  }, [api, sectionName, methodName]);

  return (
    <div className="flex flex-col gap-[8px]">
      <SectionSelect
        sectionName={sectionName}
        setSectionName={setSectionName}
      />
      <MethodSelect
        sectionName={sectionName}
        methodName={methodName}
        setMethodName={setMethodName}
      />
      <Params
        params={callState?.extrinsic?.params}
        value={callValues}
        setValue={setCallValues}
      />
    </div>
  );
}
