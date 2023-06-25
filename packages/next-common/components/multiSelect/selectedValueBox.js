import styled, { css } from "styled-components";
import SelectedValueItem from "./selectedValueItem";
import DownSVG from "./down.svg";
import noop from "lodash.noop";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  padding: 10px 16px;

  border-radius: 4px;
  border: 1px solid ${(p) => p.theme.grey300Border};
  background: ${(p) => p.theme.neutral};
`;

const ValueContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  gap: 8px;
`;

const IconWrapper = styled.div`
  display: inline-flex;
  cursor: pointer;
  ${(p) =>
    p.showDropDown &&
    css`
      transform: rotate(180deg);
    `}
`;

export default function SelectedValueBox({
  options = [],
  selectedValues = [],
  setSelectedValues = noop,
  showDropDown = false,
  setShowDropDown = noop,
}) {
  const showOptions = options.filter((o) => selectedValues.includes(o.value));
  const onRemove = (value) => {
    setSelectedValues(selectedValues.filter((v) => v !== value));
  };

  return (
    <Wrapper>
      <ValueContent>
        {showOptions.map((o) => (
          <SelectedValueItem
            key={o.value}
            title={o.label}
            onRemove={() => onRemove(o.value)}
          />
        ))}
      </ValueContent>
      <IconWrapper
        showDropDown={showDropDown}
        onClick={() => setShowDropDown(!showDropDown)}
      >
        <DownSVG />
      </IconWrapper>
    </Wrapper>
  );
}
