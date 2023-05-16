import React, { useCallback, useEffect, useState } from "react";
import ReactSlider from "react-slider";
import styled from "styled-components";
import ThumbSVG from "./thumb.svg";
import { p_12_normal } from "next-common/styles/componentCss";
import noop from "lodash.noop";

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
  background: ${(p) => p.theme.neutral};
  width: 20px;
  height: 20px;
  box-shadow: 0px 6px 22px ${(p) => p.theme.textPrimary}1C,
    0px 1.34018px 4.91399px ${(p) => p.theme.textPrimary}0F,
    0px 0.399006px 1.46302px ${(p) => p.theme.textPrimary}0A;
  border-radius: 4px;
  &:focus-visible {
    outline: none;
  }
  svg path {
    stroke: ${(p) => p.theme.grey400Border};
  }
`;

const StyledThumbValue = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  ${p_12_normal}
  color: ${(p) => p.theme.textSecondary};
`;

function useThumb({ formatValue = (val) => val }) {
  return useCallback(
    (props, state) => (
      <StyledThumb {...props}>
        <ThumbSVG />
        <StyledThumbValue>{formatValue(state.valueNow)}</StyledThumbValue>
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
      ? props.theme.grey100Bg
      : props.index === 1
      ? props.theme.grey300Border
      : props.theme.grey100Bg};
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

export default function Slider({
  min,
  max,
  onChange = noop,
  formatValue,
  defaultValue,
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
      renderTrack={Track}
      renderThumb={Thumb}
      onChange={onChange}
    />
  );
}
