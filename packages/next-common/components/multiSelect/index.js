import styled from "styled-components";
import SelectedValueBox from "./selectedValueBox";
import { useRef, useState } from "react";
import noop from "lodash.noop";
import DropDownList from "./dropDownList";
import useOnClickOutside from "next-common/utils/hooks/useOnClickOutside";
import { OptionsWrapper } from "../select/styled";
import { cn } from "next-common/utils";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export default function MultiSelect({
  disabled = false,
  itemName = "item",
  options = [],
  selectedValues = [],
  setSelectedValues = noop,
  small = false,
  maxDisplayItem,
}) {
  const [showDropDown, setShowDropDown] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setShowDropDown(false));

  const itemHeight = small ? 32 : 40;

  return (
    <Wrapper ref={ref}>
      <SelectedValueBox
        disabled={disabled}
        itemName={itemName}
        options={options}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        showDropDown={showDropDown}
        setShowDropDown={setShowDropDown}
      />
      {showDropDown && (
        <OptionsWrapper>
          <div
            className={cn(
              maxDisplayItem && "scrollbar-pretty overflow-y-scroll",
            )}
            style={{
              maxHeight: maxDisplayItem && itemHeight * maxDisplayItem,
            }}
          >
            <DropDownList
              itemName={itemName}
              options={options}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
            />
          </div>
        </OptionsWrapper>
      )}
    </Wrapper>
  );
}
