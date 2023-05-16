import React from "react";
import Slider from "../slider";

export default function ReferendaSlider({
  marginLeft,
  turnout,
  onSliderChange,
  defaultRange,
}) {
  if (!turnout || turnout.length < 10) {
    return null;
  }

  return (
    <div style={{ marginTop: 9, marginLeft, marginBottom: 48 }}>
      <Slider
        min={0}
        max={turnout ? turnout.length - 1 : 0}
        onChange={onSliderChange}
        formatValue={(val) => turnout?.[val]?.referendumIndex}
        defaultValue={defaultRange}
      />
    </div>
  );
}
