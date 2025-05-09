import { noop } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import RadioButton from "./radioButton";
import Divider from "next-common/components/styled/layout/divider";
import tw from "tailwind-styled-components";
import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

export default function RadioOption({ checked, label, onClick = noop }) {
  return (
    <div className="flex gap-2 cursor-pointer" onClick={onClick}>
      <RadioButton checked={checked} />
      <span>{label}</span>
    </div>
  );
}

const RadioOptionWrapper = tw.div`
gap-2 cursor-pointer p-3 pr-4 border border-neutral400 rounded-lg
`;

const RadioOptionHeader = tw.header`
flex justify-between items-center w-full
`;

const RadioOptionIndex = tw.span`
text14Medium text-textPrimary inline-block w-10 text-center
`;

const RadioOptionFooter = tw.footer`
flex justify-between items-center w-full px-10
`;

const RadioOptionItem = tw.div`
text12Medium text-textTertiary gap-x-2 flex
`;

const RadioOptionValue = tw.span`
text-textPrimary
`;

function DisabledTooltipWrapper({ children, disabled }) {
  if (!disabled) {
    return children;
  }

  return (
    <Tooltip content="Currently in the judgement request process">
      {children}
    </Tooltip>
  );
}

export function RequestJudgementRadioOption({
  checked,
  judgement,
  disabled,
  onClick = noop,
}) {
  if (!judgement) {
    return null;
  }
  return (
    <DisabledTooltipWrapper disabled={disabled}>
      <RadioOptionWrapper
        onClick={onClick}
        className={cn(disabled ? "bg-neutral200 border-neutral300" : "")}
      >
        <RadioOptionHeader>
          <div className="flex items-center flex-1">
            <RadioOptionIndex>#{judgement.index}</RadioOptionIndex>
            <AddressUser add={judgement.account} size={20} user={{}} />
          </div>
          <RadioButton checked={checked} disabled={disabled} />
        </RadioOptionHeader>
        <Divider className="my-3" />
        <RadioOptionFooter>
          <RadioOptionItem>
            <span>Fee</span>
            <RadioOptionValue>
              {judgement.fee} {judgement.symbol}
            </RadioOptionValue>
          </RadioOptionItem>
        </RadioOptionFooter>
      </RadioOptionWrapper>
    </DisabledTooltipWrapper>
  );
}
