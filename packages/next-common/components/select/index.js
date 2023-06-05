import React, { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Option from "./option";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import { pretty_scroll_bar, shadow_200 } from "../../styles/componentCss";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import Caret from "../icons/caret";

const SelectWrapper = styled(FlexBetweenCenter)`
  position: relative;
  font-size: 14px;
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-radius: 4px;
  height: ${(p) => p.height}px;
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

const OptionsWrapper = styled.div`
  position: absolute;
  left: -1px;
  right: 0;
  top: calc(100% + 4px);
  background: ${(props) => props.theme.neutral};
  ${shadow_200};
  border-radius: 4px;
  padding: 8px 0;
  width: calc(100% + 2px);
  z-index: 999999;
  color: ${(props) => props.theme.textPrimary};

  ${(p) =>
    p.theme.isDark &&
    css`
      border: 1px solid ${p.theme.grey200Border};
    `}

  ${(p) =>
    p.maxDisplayItem &&
    css`
      max-height: ${p.height * p.maxDisplayItem}px;
      overflow-y: scroll;
      ${pretty_scroll_bar};
    `}
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

  const selectorHeight = !small ? 40 : 32;

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
      height={selectorHeight}
    >
      <SelectInner>
        <span>{displayValue}</span>
        <Caret down={!showOptions} />
      </SelectInner>

      {showOptions && (
        <OptionsWrapper height={selectorHeight} maxDisplayItem={maxDisplayItem}>
          {options.map((option) => (
            <Option
              key={option.value}
              active={value === option.value}
              onClick={() => onChange(option)}
              height={selectorHeight}
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
