import { useEffect, useState } from "react";
import { getTypeDef } from "@polkadot/types/create";
import MethodSelect from "./methodSelect";
import Params from "./params";
import SectionSelect from "./sectionSelect";
import useApi from "next-common/utils/hooks/useApi";

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

export default function Extrinsic() {
  const api = useApi();
  const [sectionName, setSectionName] = useState("system");
  const [methodName, setMethodName] = useState("setCode");
  const [callState, setCallState] = useState();

  useEffect(() => {
    if (!api) return;

    const fn = api.tx[sectionName][methodName];

    setCallState((prev) =>
      prev?.extrinsic.fn.section === sectionName &&
      prev?.extrinsic.fn.method === methodName
        ? prev
        : getCallState(fn),
    );
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
      <Params params={callState?.params} />
    </div>
  );
}
