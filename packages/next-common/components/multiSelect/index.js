import styled from "styled-components";
import SelectedValueBox from "./selectedValueBox";
import { useRef, useState } from "react";
import noop from "lodash.noop";
import DropDownList from "./dropDownList";
import useOnClickOutside from "next-common/utils/hooks/useOnClickOutside";
import { OptionsWrapper } from "../select/styled";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export default function MultiSelect({
  labelAll,
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
        options={options}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        showDropDown={showDropDown}
        setShowDropDown={setShowDropDown}
      />
      {showDropDown && (
        <OptionsWrapper itemHeight={itemHeight} maxDisplayItem={maxDisplayItem}>
          <DropDownList
            labelAll={labelAll}
            options={options}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
          />
        </OptionsWrapper>
      )}
    </Wrapper>
  );
}
