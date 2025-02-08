import { ExtrinsicFieldWithLoading } from "next-common/components/popup/fields/extrinsicField";
import { useMultisigSignContext } from "./context";

const defaultSectionName = "system";
const defaultMethodName = "setCode";

export default function ProposeWithExtrinsic() {
  const { setValue } = useMultisigSignContext();

  return (
    <ExtrinsicFieldWithLoading
      label="Propose"
      defaultSectionName={defaultSectionName}
      defaultMethodName={defaultMethodName}
      setValue={setValue}
    />
  );
}
