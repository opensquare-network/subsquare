import { ExtrinsicFieldWithLoading } from "next-common/components/popup/fields/extrinsicField";

const defaultSectionName = "system";
const defaultMethodName = "setCode";

export default function ProposeWithExtrinsic({ setValue }) {
  return (
    <ExtrinsicFieldWithLoading
      label="Propose"
      defaultSectionName={defaultSectionName}
      defaultMethodName={defaultMethodName}
      setValue={setValue}
    />
  );
}
