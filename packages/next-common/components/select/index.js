import React, { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Option from "./option";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { ArrowDown } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { OptionsWrapper } from "./styled";
import Divider from "../styled/layout/divider";

const SearchInput = styled.input`
  width: 100%;
  height: 32px;
  outline: none;
  padding: 10px 16px;
`;

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
  search = false,
}) {
  const ref = useRef();
  const [searchText, setSearchText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  useOnClickOutside(ref, () => setShowOptions(false));

  const filteredOptions = useMemo(() => {
    if (!search || !searchText) {
      return options;
    }
    return options.filter((option) =>
      (option.text || option.value)
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

  const displayValue = useMemo(
    () => filteredOptions.find((option) => option.value === value)?.label,
    [filteredOptions, value],
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
          {search && (
            <>
              <SearchInput
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Divider style={{ margin: "8px 0" }} />
            </>
          )}
          {filteredOptions.map((option) => (
            <Option
              key={option.value}
              active={value === option.value}
              onClick={() => onChange(option)}
              height={theItemHeight}
            >
              {option.label}
            </Option>
          ))}
          {filteredOptions.length === 0 && (
            <div className="text12Medium text-textTertiary text-center px-[16px] py-[10px]">
              No results
            </div>
          )}
        </OptionsWrapper>
      )}
    </SelectWrapper>
  );
}

export default Select;
