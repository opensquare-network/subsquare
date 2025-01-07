import { ArrowUp } from "@osn/icons/subsquare";
import { useRef, useState } from "react";
import { OptionsWrapper } from "../select/styled";
import Option from "../select/option";
import { useClickAway } from "react-use";
import CurrencyInput from "../currencyInput";
import { cn } from "next-common/utils";

export default function SymbolSelectInput({
  symbolOptions,
  disabled,
  value,
  onValueChange,
  symbol,
  onSymbolChange,
}) {
  const ref = useRef();
  const [showOptions, setShowOptions] = useState(false);
  useClickAway(ref, () =>
    setTimeout(() => {
      setShowOptions(false);
    }, 100),
  );

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="relative">
      <CurrencyInput
        placeholder="0.00"
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        post={
          <div
            role="button"
            className="flex h-full items-center gap-[10px] cursor-pointer"
            ref={ref}
            onClick={handleShowOptions}
          >
            <span>{symbol}</span>
            <div className="inline-flex mr-[-6px]">
              <ArrowUp className={cn("w-4 h-4", showOptions && "rotate-180")} />
            </div>
          </div>
        }
      />
      {showOptions && (
        <OptionsWrapper className="left-auto max-w-[160px] text14Medium">
          {symbolOptions.map((item) => (
            <Option key={item} onClick={() => onSymbolChange(item)}>
              {item}
            </Option>
          ))}
        </OptionsWrapper>
      )}
    </div>
  );
}
