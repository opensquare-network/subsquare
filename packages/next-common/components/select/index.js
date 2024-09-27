import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Option from "./option";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { ArrowDown } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import {
  OptionsPadLeftWrapper,
  OptionsPadRightWrapper,
  OptionsWrapper,
} from "./styled";
import Divider from "../styled/layout/divider";
import { useClickAway } from "react-use";

const SearchInput = styled.input`
  width: 100%;
  height: 32px;
  outline: none;
  padding: 10px 16px;
  background: var(--neutral100);
  &::placeholder {
    color: var(--textTertiary);
  }
`;

const SelectWrapper = styled(FlexBetweenCenter)`
  position: relative;
  font-size: 14px;
  background: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 6px;
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
  search = false,
  readOnly = false,
  optionsPadding = "",
  placeholder = "",
}) {
  const ref = useRef();
  const [searchText, setSearchText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  useClickAway(ref, () => setShowOptions(false));
  const selectedOptionRef = useRef();

  useEffect(() => {
    if (!showOptions || !selectedOptionRef.current) {
      return;
    }
    selectedOptionRef.current.scrollIntoView({
      block: "nearest",
    });
  }, [showOptions, selectedOptionRef]);

  const filteredOptions = useMemo(() => {
    if (!search || !searchText) {
      return options;
    }
    return options.filter((option) =>
      (option.text || option.label)
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    );
  }, [options, search, searchText]);

  const theItemHeight = itemHeight || (!small ? 40 : 32);

  const handleShowOptions = () => {
    if (disabled) {
      return;
    }
    setSearchText("");
    setShowOptions(!showOptions);
  };

  const displayValue = useMemo(() => {
    const item = filteredOptions.find((option) => option.value === value);
    return (
      <div className="flex items-center">
        {item?.icon && <div className="mr-2 flex">{item.icon}</div>}
        {item?.displayValue || item?.label || item?.text}
      </div>
    );
  }, [filteredOptions, value]);

  let DropdownOptionsWrapper = OptionsWrapper;
  if (optionsPadding === "left") {
    DropdownOptionsWrapper = OptionsPadLeftWrapper;
  } else if (optionsPadding === "right") {
    DropdownOptionsWrapper = OptionsPadRightWrapper;
  }

  return (
    <SelectWrapper
      className={cn(className, readOnly && "pointer-events-none")}
      ref={ref}
      disabled={disabled}
      onClick={handleShowOptions}
      itemHeight={theItemHeight}
    >
      <SelectInner>
        <div className="overflow-hidden">
          {displayValue ? (
            displayValue
          ) : (
            <span className="text-textDisabled">{placeholder}</span>
          )}
        </div>
        {!readOnly && (
          <div>
            <ArrowDown
              className={cn(
                showOptions && "rotate-180",
                "w-5 h-5",
                "[&_path]:stroke-textTertiary",
              )}
            />
          </div>
        )}
      </SelectInner>

      {showOptions && (
        <DropdownOptionsWrapper>
          {search && (
            <>
              <SearchInput
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Please input to search..."
              />
              <Divider style={{ margin: "8px 0" }} />
            </>
          )}
          {filteredOptions.length === 0 ? (
            <div className="text12Medium text-textTertiary text-center px-[16px] py-[10px]">
              No results
            </div>
          ) : (
            <div
              className={cn(
                maxDisplayItem &&
                  "scrollbar-hidden overflow-x-hidden overflow-y-scroll",
              )}
              style={{
                maxHeight: maxDisplayItem && theItemHeight * maxDisplayItem,
              }}
            >
              {filteredOptions.map((option, index) =>
                option.divider ? (
                  <Divider key={index} className="my-[8px]" />
                ) : (
                  <Option
                    key={option.value}
                    active={value === option.value}
                    ref={value === option.value ? selectedOptionRef : undefined}
                    onClick={() => onChange(option)}
                    height={theItemHeight}
                  >
                    {option?.icon && (
                      <div className="mr-2 flex">{option.icon}</div>
                    )}
                    {option.label || option.text}
                  </Option>
                ),
              )}
            </div>
          )}
        </DropdownOptionsWrapper>
      )}
    </SelectWrapper>
  );
}

export default Select;
