import styled, { css } from "styled-components";
import SelectedSVG from "./selected.svg";
import { pretty_scroll_bar, shadow_200 } from "next-common/styles/componentCss";

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  margin-top: 4px;
  width: 100%;
  flex-direction: column;
  border-radius: 4px;
  background: ${(p) => p.theme.neutral};
  ${shadow_200};

  ${(p) =>
    p.theme.isDark &&
    css`
      border: 1px solid ${p.theme.grey200Border};
    `}

  ${(p) =>
    p.maxDisplayItem &&
    css`
      max-height: ${p.itemHeight * p.maxDisplayItem}px;
      overflow-y: scroll;
      ${pretty_scroll_bar};
    `}
`;

const ListItem = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  gap: 10px;

  font-size: 14px;
  line-height: 20px;

  cursor: pointer;
  ${p => p.selected && css`
    background: ${(p) => p.theme.grey100Bg};
  `}
  :hover {
    background: ${(p) => p.theme.grey100Bg};
  }
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${(p) => p.theme.grey200Border};
`;

export default function DropDownList({
  labelAll = "All",
  options,
  selectedValues,
  setSelectedValues,
  itemHeight,
  maxDisplayItem,
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
    <Wrapper itemHeight={itemHeight} maxDisplayItem={maxDisplayItem}>
      <Items>
        <ListItem selected={all} onClick={() => toggleAll()}>
          <span>{labelAll}</span>
          {all && <SelectedSVG />}
        </ListItem>
      </Items>
      <Divider />
      <Items>
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
      </Items>
    </Wrapper>
  );
}
