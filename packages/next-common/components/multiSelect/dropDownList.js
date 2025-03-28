import styled, { css } from "styled-components";
import SelectedSVG from "./selected.svg";
import pluralize from "pluralize";
import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

function ListItem({ disabled, selected, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "text14Medium",
        "cursor-pointer",
        "flex grow items-center justify-between gap-2.5",
        "py-2.5 px-4",
        disabled ? "cursor-not-allowed" : "hover:bg-neutral200",
        selected && "bg-neutral200",
        props.className,
      )}
    />
  );
}

const TrackName = styled.span`
  ${(p) =>
    p.disabled &&
    css`
      color: var(--textDisabled);
    `}
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: var(--gray200);
  margin: 8px 0;
`;

const Info = styled.span`
  color: var(--textTertiary);
`;

const InfoTooltip = styled(Tooltip)`
  cursor: pointer;
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
            {o.disabled && o.info && o.tooltipContent ? (
              <InfoTooltip content={o.tooltipContent}>
                <Info>{o.info}</Info>
              </InfoTooltip>
            ) : (
              <Info>{o.info}</Info>
            )}
            {selected && !o.disabled && <SelectedSVG />}
          </ListItem>
        );
      })}
    </Wrapper>
  );
}
