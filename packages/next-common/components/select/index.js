import React, { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Option from "./option";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import { shadow_200 } from "../../styles/componentCss";
import { CaretDown } from "../icons";
import FlexBetweenCenter from "../styled/flexBetweenCenter";

const selectorHeight = 38;

const SelectWrapper = styled(FlexBetweenCenter)`
  position: relative;
  font-size: 14px;
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-radius: 4px;
  height: ${selectorHeight}px;
  padding: 0 12px;
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

const OptionsWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: ${selectorHeight + 4}px;
  background: ${(props) => props.theme.neutral};
  ${shadow_200};
  border-radius: 4px;
  padding: 8px 0;
  width: 100%;
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)} px;
  border-color: ${(props) => props.theme.grey300Border};
  z-index: 999999;
  color: ${(props) => props.theme.textPrimary};
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
