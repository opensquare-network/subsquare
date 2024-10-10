import { ArrowDown, ArrowUp } from "@osn/icons/subsquare";
import Input from "next-common/components/input";
import { useRef, useState } from "react";
import { OptionsWrapper } from "../select/styled";
import Option from "../select/option";
import { useClickAway } from "react-use";

export default function SymbolSelectInput({
  symbolOptions,
  disabled,
  value,
  onChange,
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
      <Input
        type="text"
        placeholder="0.00"
        disabled={disabled}
        value={value}
        onChange={onChange}
        symbol={
          <div
            className="flex h-full items-center gap-[10px] cursor-pointer"
            ref={ref}
            onClick={handleShowOptions}
          >
            <span>{symbol}</span>
            <div className="inline-flex mr-[-6px]">
              {showOptions ? (
                <ArrowUp width={20} height={20} />
              ) : (
                <ArrowDown width={20} height={20} />
              )}
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
