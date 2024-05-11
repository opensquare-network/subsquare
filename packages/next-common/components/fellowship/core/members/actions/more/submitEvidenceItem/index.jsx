import { noop } from "lodash-es";
import { OptionItem } from "next-common/components/internalDropdown/styled";
import { SystemEdit } from "@osn/icons/subsquare";

export default function SubmitEvidenceItem({ onClick = noop }) {
  return (
    <>
      <OptionItem
        className="flex items-center grow"
        role="button"
        onClick={onClick}
      >
        <div className="inline-flex mr-[8px]">
          <SystemEdit className="w-[24px] h-[24px]" />
        </div>
        <span className="whitespace-nowrap">Submit Evidence</span>
      </OptionItem>
    </>
  );
}
