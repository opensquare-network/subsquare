import { useEffect, useState } from "react";
import { getTypeDef } from "@polkadot/types/create";
import MethodSelect from "./methodSelect";
import Params from "./params";
import SectionSelect from "./sectionSelect";
import useApi from "next-common/utils/hooks/useApi";
import { useObjectItemState } from "next-common/hooks/useItemState";

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

export default function Extrinsic({
  defaultSectionName,
  defaultMethodName,
  // value,
  setValue,
}) {
  const api = useApi();
  const [sectionName, setSectionName] = useState(defaultSectionName);
  const [methodName, setMethodName] = useState(defaultMethodName);
  const [callState, setCallState] = useState();
  console.log(callState);

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
      const tx = fn(...values);
      setValue(tx);
    } catch (e) {
      setValue(undefined);
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
