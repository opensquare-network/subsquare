import React, { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Option from "./option";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { ArrowDown } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { OptionsWrapper } from "./styled";

const SelectWrapper = styled(FlexBetweenCenter)`
  position: relative;
  font-size: 14px;
  background: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  height: ${(p) => p.itemHeight}px;
  padding: 10px 16px;
  cursor: pointer;
  color: var(--textPrimary);
  ${(p) =>
    p.disabled &&
    css`
      background-color: var(--neutral200);
      color: var(--textDisabled);
      cursor: default;

      svg {
        path {
          stroke: var(--textDisabled);
        }
      }
    `}
`;

const SelectInner = styled(FlexBetweenCenter)`
  width: 100%;
  overflow: hidden;
`;

function Select({
  disabled = false,
  value,
  options = [],
  onChange = () => {},
  maxDisplayItem,
  className = "",
  small = false,
  itemHeight,
}) {
  const ref = useRef();
  const [showOptions, setShowOptions] = useState(false);
  useOnClickOutside(ref, () => setShowOptions(false));

  const theItemHeight = itemHeight || (!small ? 40 : 32);

  const handleShowOptions = () => {
    if (disabled) {
      return;
    }

    setShowOptions(!showOptions);
  };

  const displayValue = useMemo(
    () =>
      options.find((option) => option.value === value)?.label ||
      options[0]?.label,
    [options, value],
  );

  return (
    <SelectWrapper
      className={className}
      ref={ref}
      disabled={disabled}
      onClick={handleShowOptions}
      itemHeight={theItemHeight}
    >
      <SelectInner>
        <div className="overflow-hidden">{displayValue}</div>
        <div>
          <ArrowDown
            className={cn(
              showOptions && "rotate-180",
              "w-5 h-5",
              "[&_path]:stroke-textTertiary",
            )}
          />
        </div>
      </SelectInner>

      {showOptions && (
        <OptionsWrapper
          itemHeight={theItemHeight}
          maxDisplayItem={maxDisplayItem}
        >
          {options.map((option) => (
            <Option
              key={option.value}
              active={value === option.value}
              onClick={() => onChange(option)}
              height={theItemHeight}
            >
              {option.label}
            </Option>
          ))}
        </OptionsWrapper>
      )}
    </SelectWrapper>
  );
}

export default Select;
