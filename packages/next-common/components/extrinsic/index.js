import { useState } from "react";
import MethodSelect from "./methodSelect";
import Params from "./params";
import SectionSelect from "./sectionSelect";

export default function Extrinsic() {
  const [sectionName, setSectionName] = useState("system");
  const [methodName, setMethodName] = useState("setCode");

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
      <Params />
    </div>
  );
}
