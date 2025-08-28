import React, { useCallback, useEffect, useState } from "react";
import ReactSlider from "react-slider";
import styled from "styled-components";
import ThumbSVG from "./thumb.svg";
import { noop } from "lodash-es";

const StyledSlider = styled(ReactSlider)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 6px;
`;

const StyledThumb = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  background: var(--neutral100);
  width: 20px;
  height: 20px;
  box-shadow: var(--shadow100);
  border-radius: 4px;
  border: 1px solid var(--neutral300);
  &:focus-visible {
    outline: none;
  }
  svg path {
    stroke: var(--neutral500);
  }
`;

function useThumb({ formatValue = (val) => val }) {
  return useCallback(
    (props, state) => (
      <StyledThumb {...props}>
        <ThumbSVG />
        <div className="absolute top-[calc(100%+8px)] flex items-center justify-center w-full text12Medium text-textSecondary">
          {formatValue(state.valueNow)}
        </div>
      </StyledThumb>
    ),
    [formatValue],
  );
}

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${(props) =>
    props.index === 2
      ? "var(--neutral200)"
      : props.index === 1
      ? "var(--neutral400)"
      : "var(--neutral200)"};
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

export default function Slider({
  min,
  max,
  onChange = noop,
  formatValue,
  defaultValue,
  minDistance = 0,
}) {
  const Thumb = useThumb({ formatValue });
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);
  if (!show) {
    return null;
  }
  return (
    <StyledSlider
      min={min}
      max={max}
      defaultValue={defaultValue || [min, max]}
      minDistance={minDistance}
      renderTrack={Track}
      renderThumb={Thumb}
      onChange={onChange}
    />
  );
}
