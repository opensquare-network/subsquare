import { noop } from "lodash-es";
import RadioOption, { RequestJudgementRadioOption } from "./radioOption";
import { cn } from "next-common/utils";

export const RadioOptionGroupType = {
  DEFAULT: "default",
  REQUEST_JUDGEMENT: "requestJudgement",
};

const RadioOptionComponents = {
  [RadioOptionGroupType.REQUEST_JUDGEMENT]: RequestJudgementRadioOption,
  [RadioOptionGroupType.DEFAULT]: RadioOption,
};

export default function RadioOptionGroup({
  type = RadioOptionGroupType.DEFAULT,
  className = "",
  options,
  selected,
  setSelected = noop,
}) {
  const RadioOptionComponent =
    RadioOptionComponents[type] || RadioOptionComponents.DEFAULT;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(options || []).map((item) => (
        <RadioOptionComponent
          key={item.value}
          {...item}
          checked={selected === item.value}
          onClick={() => setSelected(item.value)}
        />
      ))}
    </div>
  );
}
