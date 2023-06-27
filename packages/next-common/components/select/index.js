import React, { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Option from "./option";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import Caret from "../icons/caret";
import { OptionsWrapper } from "./styled";

const SelectWrapper = styled(FlexBetweenCenter)`
  position: relative;
  font-size: 14px;
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-radius: 4px;
  height: ${(p) => p.itemHeight}px;
  padding: 10px 16px;
  cursor: pointer;
  color: ${(props) => props.theme.textPrimary};
  ${(p) =>
    p.disabled &&
    css`
      background-color: ${(props) => props.theme.grey100Bg};
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

function Select({
  disabled = false,
  value,
  options = [],
  onChange = () => {},
  maxDisplayItem,
  className = "",
  small = false,
}) {
  const ref = useRef();
  const [showOptions, setShowOptions] = useState(false);
  useOnClickOutside(ref, () => setShowOptions(false));

  const itemHeight = !small ? 40 : 32;

  const handleShowOptions = () => {
    if (disabled) {
      return;
    }

    setShowOptions(!showOptions);
  };

  const displayValue = useMemo(
    () => options.find((option) => option.value === value)?.label,
    [value],
  );

  return (
    <SelectWrapper
      className={className}
      ref={ref}
      disabled={disabled}
      onClick={handleShowOptions}
      itemHeight={itemHeight}
    >
      <SelectInner>
        <span>{displayValue}</span>
        <Caret down={!showOptions} />
      </SelectInner>

      {showOptions && (
        <OptionsWrapper itemHeight={itemHeight} maxDisplayItem={maxDisplayItem}>
          {options.map((option) => (
            <Option
              key={option.value}
              active={value === option.value}
              onClick={() => onChange(option)}
              height={itemHeight}
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
