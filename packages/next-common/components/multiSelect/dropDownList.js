import styled, { css } from "styled-components";
import SelectedSVG from "./selected.svg";
import { p_14_normal } from "next-common/styles/componentCss";
import pluralize from "pluralize";

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
    p.disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          :hover {
            background: ${(p) => p.theme.grey100Bg};
          }
        `}

  ${(p) =>
    p.selected &&
    css`
      background: ${(p) => p.theme.grey100Bg};
    `}
`;

const TrackName = styled.span`
  ${(p) =>
    p.disabled &&
    css`
      color: ${(p) => p.theme.textPlaceholder};
    `}
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${(p) => p.theme.grey200Border};
  margin: 8px 0;
`;

const Info = styled.span`
  color: ${(p) => p.theme.textTertiary};
`;

export default function DropDownList({
  itemName,
  options,
  selectedValues,
  setSelectedValues,
}) {
  const availableOptions = options.filter((o) => !o.disabled);

  const toggleSelect = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const all = selectedValues.length === availableOptions.length;
  const toggleAll = () => {
    if (!all) {
      setSelectedValues(availableOptions.map((o) => o.value));
    } else {
      setSelectedValues([]);
    }
  };

  return (
    <Wrapper>
      <ListItem selected={all} onClick={() => toggleAll()}>
        <span>All {pluralize(itemName)}</span>
        {all && <SelectedSVG />}
      </ListItem>
      <Divider />
      {options?.map((o) => {
        const selected = selectedValues.includes(o.value);
        return (
          <ListItem
            key={o.value}
            selected={selected}
            disabled={o.disabled}
            onClick={() => {
              if (o.disabled) {
                return;
              }
              toggleSelect(o.value);
            }}
          >
            <TrackName disabled={o.disabled}>{o.label}</TrackName>
            <Info>{o.info}</Info>
            {selected && !o.disabled && <SelectedSVG />}
          </ListItem>
        );
      })}
    </Wrapper>
  );
}
