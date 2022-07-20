import React, { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Option from "./option";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import { shadow_200 } from "../../styles/componentCss";
import { CaretDown } from "../icons";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { light_text_primary } from "../../styles/colors";

const selectorHeight = 38;

const SelectWrapper = styled(FlexBetweenCenter)`
  position: relative;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  height: ${selectorHeight}px;
  padding: 0 12px;
  cursor: pointer;
  color: ${light_text_primary};
  :hover {
    border-color: #c2c8d5;
  }
  ${(p) =>
    p.disabled &&
    css`
      background-color: #f6f7fa;
      color: #e0e5ed;
      cursor: default;

      svg {
        path {
          stroke: #e0e5ed;
        }
      }
    `}
`;

const SelectInner = styled(FlexBetweenCenter)`
  width: 100%;
`;

const OptionsWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: ${selectorHeight + 4}px;
  background-color: #ffffff;
  ${shadow_200};
  border-radius: 4px;
  padding: 8px 0;
  width: 100%;
  z-index: 999999;
`;

function Select({
  disabled = false,
  value,
  options = [],
  onChange = () => {},
}) {
  const ref = useRef();
  const [showOptions, setShowOptions] = useState(false);

  useOnClickOutside(ref, () => setShowOptions(false));

  const handleShowOptions = () => {
    if (disabled) {
      return;
    }

    setShowOptions(!showOptions);
  };

  const displayValue = useMemo(
    () => options.find((option) => option.value === value)?.label,
    [value]
  );

  return (
    <SelectWrapper ref={ref} disabled={disabled} onClick={handleShowOptions}>
      <SelectInner>
        <span>{displayValue}</span>
        <CaretDown className="select-caret-down" width={14} height={14} />
      </SelectInner>

      {showOptions && (
        <OptionsWrapper>
          {options.map((option) => (
            <Option
              key={option.value}
              active={value === option.value}
              onClick={() => onChange(option)}
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
