import styled, { css } from "styled-components";
import SelectedSVG from "./selected.svg";
import { p_14_normal } from "next-common/styles/componentCss";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  gap: 10px;

  ${p_14_normal}

  ${(p) =>
    p.selected &&
    css`
      background: ${(p) => p.theme.grey100Bg};
    `}

  :hover {
    background: ${(p) => p.theme.grey100Bg};
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${(p) => p.theme.grey200Border};
  margin: 8px 0;
`;

export default function DropDownList({
  labelAll = "All",
  options,
  selectedValues,
  setSelectedValues,
}) {
  const toggleSelect = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const all = selectedValues.length === options.length;
  const toggleAll = () => {
    if (!all) {
      setSelectedValues(options.map((o) => o.value));
    } else {
      setSelectedValues([]);
    }
  };

  return (
    <Wrapper>
      <ListItem selected={all} onClick={() => toggleAll()}>
        <span>{labelAll}</span>
        {all && <SelectedSVG />}
      </ListItem>
      <Divider />
      {options?.map((o) => {
        const selected = selectedValues.includes(o.value);
        return (
          <ListItem
            key={o.value}
            selected={selected}
            onClick={() => toggleSelect(o.value)}
          >
            <span>{o.label}</span>
            {selected && <SelectedSVG />}
          </ListItem>
        );
      })}
    </Wrapper>
  );
}
